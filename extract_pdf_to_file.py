import pypdf
import json

pdf_path = "5.sınıf ingilizce tarama.pdf"
output_path = "pdf_content.txt"

try:
    reader = pypdf.PdfReader(pdf_path)
    text_content = ""
    for page in reader.pages:
        text_content += page.extract_text() + "\n"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text_content)
        
    print(f"Successfully wrote content to {output_path}")

except Exception as e:
    print(f"Error: {e}")
