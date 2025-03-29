import streamlit as st
from langchain_helper import get_qa_chain, learn
from pdf_text import process_pdf
from datetime import datetime

# ✅ Streamlit config
st.set_page_config(page_title="CuraMate 🩺", layout="wide")

st.divider()

# ✅ PDF Upload
st.markdown("### 📄 Upload Patient Report (PDF)")
uploaded_file = st.file_uploader("Upload PDF ⬇️", type=["pdf"])
store_file = " "

if uploaded_file is not None:
    with st.spinner("⏳ Processing PDF... Please wait!"):
        store_file = process_pdf(uploaded_file)
    st.success("✅ PDF processed and added to the knowledge base!")

st.divider()

# ✅ Input question and response
st.markdown("### 💬 Medical Query")
question = st.text_area("Enter Your Medical Query:")

st.markdown("### 🛠️ Improve Response")
response_input = st.text_area("Submit a Better Response:", height=100)
submit_response = st.button("Submit Response")

st.divider()

# ✅ Learn new QA pair
if submit_response and question and response_input:
    store_file = (",".join(store_file))
    response_input = f'"Recommended treatment: {response_input} + {store_file}"'
    with st.spinner("⏳ Updating Knowledge Base... Please wait!"):
        learn(question, response_input.replace("\n", " "))
    st.success("✅ Your response has been added to the knowledge base!")

# ✅ Ask question and show results
if question and not submit_response:
    store_file = (",".join(store_file))

    # ✅ QA Chain (Structured Answer)
    with st.spinner("🤖 Generating structured response..."):
        chain = get_qa_chain()
        result = chain.invoke(question + store_file)
        answer_text = result["result"]
        retrieved_docs = result.get("source_documents", [])

    st.success(answer_text)

    st.markdown("### 🔍 SIMILAR CASES ENCOUNTERED")
    if retrieved_docs:
        for i, doc in enumerate(retrieved_docs):
            st.markdown(f"**🔹 Source {i+1}:**")
            st.info(doc.page_content)
    else:
        st.warning("⚠️ No retrieved source documents.")
