import fitz  
import os


def process_pdf(uploaded_file):
    """
    Extracts text from an uploaded PDF file and sends it to the front and we later send it to the back 
    """
    try:
        # Save the uploaded file temporarily method used in fitz
        temp_file_path = f"temp_{uploaded_file.name}"
        with open(temp_file_path, "wb") as f:
            f.write(uploaded_file.read()) # what we see we write it on a temp file

        # Open the PDF and extracting text from that temp file omly
        doc = fitz.open(temp_file_path)
        extracted_text = ""
        for page in doc:
            extracted_text += page.get_text("text") + "\n\n"

        doc.close()

        # Remove the temporary file
        os.remove(temp_file_path)

        if extracted_text.strip():
            # sending to the front
            return ("using your document we extracted : ", extracted_text.replace("\n", " "))
        else:
            print("⚠️ No text found in the PDF!")

    except Exception as e:
        print(f"❌ Error processing PDF: {e}")

if __name__ == "__main__":
    process_pdf()