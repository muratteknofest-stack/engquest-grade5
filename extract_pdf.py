import pypdf
import json

pdf_path = "5.sınıf ingilizce tarama.pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    text_content = ""
    for page in reader.pages:
        text_content += page.extract_text() + "\n"
    
    print("EXTRACTED_CONTENT_START")
    print(text_content)
    print("EXTRACTED_CONTENT_END")
except Exception as e:
    print(f"Error: {e}")
