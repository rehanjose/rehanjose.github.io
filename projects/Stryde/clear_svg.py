import re

with open("stryde.html", "r") as f:
    content = f.read()

placeholder = """<!-- Floor Plan SVG Diagram Placeholder -->
        <div class="fp-container" style="position: relative; width: 100%; aspect-ratio: 1/1; max-width: 650px; margin: 0 auto; background: #0a0a0a; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px dashed #333;">
            <p style="color: #6a6a6a; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Image Placeholder</p>
        </div>"""

# Ensure we remove from <!-- Floor Plan SVG Diagram --> to the closing </svg> and legend
new_content = re.sub(r'<!-- Floor Plan SVG Diagram -->.*?</style>\s*<div class="fp-container">.*?</div>\s*<!-- Legend -->\s*<div class="fp-legend">.*?</div>', placeholder, content, flags=re.DOTALL)

with open("stryde.html", "w") as f:
    f.write(new_content)
print("Cleared floor plan area.")
