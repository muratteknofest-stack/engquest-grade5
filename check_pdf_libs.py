try:
    import pypdf
    print("pypdf found")
except ImportError:
    print("pypdf not found")

try:
    import pdfminer
    print("pdfminer found")
except ImportError:
    print("pdfminer not found")

try:
    import PyPDF2
    print("PyPDF2 found")
except ImportError:
    print("PyPDF2 not found")
