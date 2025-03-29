import threading
import os
import faiss
import pandas as pd
from langchain_google_genai import GoogleGenerativeAI  # LLM for text generation
from langchain_community.vectorstores import FAISS  # FAISS for storing embeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # Embeddings for text search
from langchain_community.document_loaders import CSVLoader  # CSV Loader for dataset processing
from langchain.chains import RetrievalQA  # To answer multiple questions at a time
from langchain.prompts import PromptTemplate  # For structuring query prompts
from langchain.schema import Document
from langchain.agents import initialize_agent, Tool
from langchain.agents.agent_types import AgentType

#  Replace with your actual API key da
api1 = "AIzaSyBHhYPFiPus3Vr31z51bN3XHSKrMjqCE3A"
api2 = "AIzaSyCt3qXHjSc5gP8b2ONhuL6kfl8g7xvG380"
api3 = "AIzaSyCNWT0ImoD7NXj4XeVP6m4dn0leX6KK918"
api4 = "AIzaSyBF5HND_6Tt2Ldmolyyi7rWjy72m5D9Isk"
api_key = api4

#  Initialize Google Gemni LLm
llm = GoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=api_key)

#  Define the FAISS storage location (saves the vector database)
file_path = "faiss_index"
csv_file = "ds.csv"  # CSV file where prompts and responses are stored

#  Initialize Google Gemini Embeddings (For vectorizing text)
instr_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)


def create_vector_db():
    print("\u23F3 Updating FAISS vector database (Optimized)...")
    try:
        # Step 1: Load prompts from CSV
        loader = CSVLoader(file_path=csv_file, source_column="Prompt")
        data = loader.load()
        print(f"\u2705 Loaded {len(data)} prompts from '{csv_file}'.")

        # Step 2: Extract prompt text
        texts = [doc.page_content for doc in data]

        # Step 3: Embed the texts
        embeddings = instr_embeddings.embed_documents(texts)
        dimension = len(embeddings[0])
        num_clusters = min(64, len(embeddings) // 4) or 1  # Tunable

        print(f"🧠 Vector dimension: {dimension}, Clusters: {num_clusters}")

        # Step 4: Build FAISS IVFFlat index
        quantizer = faiss.IndexFlatL2(dimension)
        index = faiss.IndexIVFFlat(quantizer, dimension, num_clusters, faiss.METRIC_L2)

        index.train(embeddings)  # Must train before adding vectors
        index.add(embeddings)

        print("✅ FAISS IVFFlat index trained and populated.")

        # Step 5: Save using LangChain wrapper
        v_db = FAISS(embedding=instr_embeddings, index=index, documents=data)
        v_db.save_local(file_path)

        print("💾 Optimized FAISS vector database saved!")

    except FileNotFoundError:
        print(f"❌ ERROR: The file '{csv_file}' was not found. Please check the path.")
    except ValueError as ve:
        print(f"❌ ERROR: Issue with CSV content or column names - {ve}")
    except Exception as e:
        import traceback
        print("🔥 Unexpected error while creating FAISS DB:")
        traceback.print_exc()


def get_qa_chain():
    v_db = FAISS.load_local(file_path, instr_embeddings, allow_dangerous_deserialization=True)
    retriever = v_db.as_retriever(search_kwargs={"k": 2, "score_threshold": 0.99999})

    prompt_template = '''
🎯 Generate a concise clinical summary using the retrieved context and question.

If no relevant info is found, return:  
🚨 "PLEASE TEACH ME ABOUT THIS: No prior medical data found."

---

🔹 **Context:**  
{context}

🔹 **Query:**  
{question}

---

📋 **Summary:**

- **Symptoms:** [List key 2–3 symptoms]  
- **Diagnosis:** [Most likely condition]  
- **Differentials:** [If any]  
- **Treatment:** [Short plan – meds/intervention/lifestyle]  
- **OVERVIEW:**  
  | Symptom | Medication | Notes | Specialist |
  |---------|------------|-------|------------|
  | [...]   | [...]      | ...   |............|

- **Urgency:** [Escalation criteria or 'No immediate concern']  
- **Follow-up:** [Timeframe + tests if needed]  
- **Referral:** [Specialist name or 'Not required']

---

⚠️ *This is an AI-generated aid. Final decisions rest with the attending physician.*
'''


    PROMPT = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm.with_config({"memory": False}),
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={'prompt': PROMPT}
    )
    print(qa_chain)
    return qa_chain


# 🚀 ADDED ReAct Agent for reasoning-style trace

def get_react_agent():
    v_db = FAISS.load_local(file_path, instr_embeddings, allow_dangerous_deserialization=True)
    retriever = v_db.as_retriever(search_kwargs={"k": 1})

    tool = Tool(
        name="MedicalRetriever",
        func=retriever.get_relevant_documents,
        description="Use to fetch relevant medical context for patient symptoms."
    )

    agent = initialize_agent(
        tools=[tool],
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
        handle_parsing_errors=True
    )
    return agent


def add_to_faiss(prompt, response):
    try:
        v_db = FAISS.load_local(file_path, instr_embeddings, allow_dangerous_deserialization=True)
        print("✅ Loaded existing FAISS index.")
    except:
        v_db = None
        print("⚠️ No existing FAISS index found. Creating a new one.")

    # Store full prompt + response inside the FAISS vector
    full_text = f"Prompt:\n{prompt}\n\nResponse:\n{response}"
    new_doc = [Document(page_content=full_text)]

    # Update or create FAISS vector DB
    if v_db:
        v_db.add_documents(new_doc)
        print("✅ New document added to FAISS index.")
    else:
        v_db = FAISS.from_documents(new_doc, instr_embeddings)
        print("✅ New FAISS index created with initial document.")

    v_db.save_local(file_path)
    print("💾 FAISS vector database saved.")

    # Update the CSV file
    csv_data = pd.DataFrame([[prompt, response]], columns=["Prompt", "Response"])
    file_exists = os.path.exists(csv_file)

    csv_data.to_csv(csv_file, mode='a', index=False, header=not file_exists)
    print(f"🗂️ Prompt-Response added to CSV → '{csv_file}'")


def learn(prompt, response):
    df = pd.read_csv(csv_file)
    print("\n\n\n", df, "\n\n\n")
    new_data = pd.DataFrame([[prompt, response]], columns=["Prompt", "Response"])
    new_data.to_csv(csv_file, mode='a', header=False, index=False)
    print(f"\u2705 New Prompt-Response added: '{prompt}' → '{response}'")
    add_to_faiss(prompt, response)
    print("\u2705 FAISS vector database updated successfully!")


# ✅ Run the function only when this script is executed
if __name__ == "__main__":
    create_vector_db()
    # chain = get_qa_chain()
    # agent = get_react_agent()
    # print(agent.run("What should I take for throat pain and cough?"))
