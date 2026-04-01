import re

with open("stryde.html", "r") as f:
    content = f.read()

# Grab the good SVG from our fix_svg_final.py
with open("fix_svg_final.py", "r") as f:
    py_content = f.read()
    
# Extract replacement string from fix_svg_final.py
match = re.search(r'replacement\s*=\s*"""(.*?)"""', py_content, re.DOTALL)
if match:
    svg_block = match.group(1)
    # The SVG block ends with <!-- Scale note -->, but we might have included the actual text in the original?
    # No, fix_svg_final.py replaces from <!-- Floor Plan SVG Diagram --> to <!-- Scale note -->.
    
    floor_plan_section = f"""    <!-- ═══════════════════════════════════
     06.2  FLOOR PLAN
═══════════════════════════════════ -->
    <section style="padding: 120px 60px 40px;">
        <div class="label" style="text-align: center;">09.5 — The Layout</div>
        <h2 class="big-text" style="font-size: 32px; text-align: center; margin-bottom: 60px;">The Floor Plan</h2>
        
        {svg_block}
        <div style="text-align: center; margin-top: 16px;">
            <p class="body" style="font-size: 11px; color: var(--muted);">* Scale indicative only. Outer footprint approx. 38m x 48m.</p>
        </div>
    </section>

"""
    
    # We want to insert this between </section> (end of PROCESS) and 06.5 VISUAL PROCESS
    target = r'(<section class="process-strip"[^>]*>.*?</section>)\s*(<!-- ═══════════════════════════════════\s*06\.5\s*VISUAL PROCESS\s*═══════════════════════════════════ -->)'
    new_content = re.sub(target, r'\1\n\n' + floor_plan_section.replace('\\', '\\\\') + r'\2', content, flags=re.DOTALL)
    
    with open("stryde.html", "w") as out:
        out.write(new_content)
    print("Restore successful.")
else:
    print("Failed to parse svg string.")
