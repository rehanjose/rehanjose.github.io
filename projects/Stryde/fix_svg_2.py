import re

with open("stryde.html", "r") as f:
    content = f.read()

start_marker = "<!-- Floor Plan SVG Diagram -->"
end_marker = "<!-- Scale note -->"

replacement = """<!-- Floor Plan SVG Diagram -->
            <style>
                .fp-container { position: relative; width: 100%; aspect-ratio: 1/1; max-width: 650px; margin: 0 auto; }
                .fp-svg { width: 100%; height: 100%; }
                .fp-dim-line { stroke: #4a4a4a; stroke-width: 0.8px; }
                .fp-dim-text { fill: #6a6a6a; font-family: 'DM Mono', monospace; font-size: 10px; text-anchor: middle; letter-spacing: 0.1em; }
                .fp-wall { stroke: #f0ede8; stroke-width: 2.5px; fill: none; stroke-linejoin: miter; stroke-linecap: square; }
                .fp-line { stroke: #4a4a4a; stroke-width: 1px; fill: none; }
                .fp-dashed { stroke-dasharray: 4,4; stroke: #4a4a4a; stroke-width: 0.8px; }
                .lbl-l { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: 0.05em; text-anchor: middle; }
                .lbl-m { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.15em; text-anchor: middle; }
                .lbl-s { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.15em; text-anchor: middle; }
                .fp-legend { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin-top: 32px; }
                .fp-legend-item { display: flex; align-items: center; gap: 8px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #6a6a6a; }
                .fp-legend-swatch { width: 12px; height: 12px; flex-shrink: 0; box-sizing: border-box; }
            </style>

            <div class="fp-container">
                <svg class="fp-svg" viewBox="0 0 650 700" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="650" height="700" fill="#0a0a0a"/>

                    <!-- ZONES FILLS (Draw these UNDER the walls) -->
                    <rect x="100" y="170" width="70" height="410" fill="#2a1a10"/>
                    <rect x="170" y="190" width="280" height="320" fill="rgba(214,58,42,0.06)"/>
                    <rect x="450" y="430" width="70" height="80" fill="#13261a"/>

                    <!-- BUILDING BACKGROUND / EMPTY SPACES FILLS -->
                    <!-- Lobby, Walkway, Entrance are empty/black -->

                    <!-- BUILDING WALLS -->
                    <!-- Outer Boundary -->
                    <!-- Top gap: 3m -->
                    <!-- Bottom gap: Entrance fully open except for left corner -->
                    <path class="fp-wall" d="M 295 100 L 100 100 L 100 580 L 170 580" />
                    <path class="fp-wall" d="M 340 580 L 340 510 L 520 510 L 520 100 L 325 100" />
                    
                    <!-- Inner Separators -->
                    <line x1="100" y1="170" x2="520" y2="170" class="fp-line" stroke-dasharray="6,5" stroke-width="1.5" stroke="#6a6a6a"/>
                    
                    <!-- Theatre Box (Inner borders) -->
                    <rect x="170" y="170" width="280" height="340" class="fp-line"/>
                    <!-- Extending Food Zone border all the way down to the bottom wall -->
                    <line x1="170" y1="510" x2="170" y2="580" class="fp-line"/>
                    
                    <!-- Screen -->
                    <rect x="170" y="170" width="280" height="20" fill="#d63a2a"/>
                    <text x="310" y="184" class="fp-dim-text" fill="#fff" font-size="11" font-weight="bold">SCREEN</text>
                    
                    <line x1="170" y1="198" x2="450" y2="198" class="fp-line"/>
                    <text x="310" y="208" class="fp-dim-text" font-size="9">28m</text>
                    
                    <!-- Ticket Counter (Grey inner lines ONLY - outer lines are the thick white boundary) -->
                    <polyline points="450,100 450,150 520,150" class="fp-line" stroke="#6a6a6a"/>
                    <text x="485" y="119" class="lbl-s" fill="#a0a0a0">TICKET</text>
                    <text x="485" y="131" class="lbl-s" fill="#a0a0a0">COUNTER</text>
                    
                    <!-- Theatre Lines -->
                    <line x1="180" y1="230" x2="440" y2="230" stroke="#3d1c16" stroke-width="1.5"/>
                    <line x1="180" y1="260" x2="440" y2="260" stroke="#3d1c16" stroke-width="1.5"/>
                    <line x1="180" y1="290" x2="440" y2="290" stroke="#3d1c16" stroke-width="1.5"/>
                    <line x1="180" y1="320" x2="440" y2="320" stroke="#3d1c16" stroke-width="1.5"/>
                    <line x1="180" y1="350" x2="440" y2="350" stroke="#3d1c16" stroke-width="1.5"/>
                    <!-- Gap for THEATRE text -->
                    <line x1="180" y1="450" x2="440" y2="450" stroke="#3d1c16" stroke-width="1.5"/>
                    <line x1="180" y1="480" x2="440" y2="480" stroke="#3d1c16" stroke-width="1.5"/>
                    
                    <!-- TEXT LABELS -->
                    <text x="310" y="145" class="lbl-l" fill="#3b77a8">LOBBY</text>
                    <text x="135" y="375" class="lbl-m" fill="#b87333" transform="rotate(-90 135 375)">FOOD ZONE</text>
                    <text x="310" y="415" class="lbl-l" fill="#d63a2a">THEATRE</text>
                    <text x="310" y="430" class="fp-dim-text" font-size="10">28m × 34m</text>
                    <text x="485" y="300" class="lbl-m" fill="#3b77a8" transform="rotate(-90 485 300)">WALKWAY</text>
                    <text x="485" y="475" class="lbl-m" fill="#4da39b">TOILET</text>
                    <!-- ENTRANCE text precisely above the gap opening, centered in its width (170-340) -> 255 -->
                    <text x="255" y="570" class="lbl-s" fill="#6a6a6a">ENTRANCE</text>

                    <!-- DIMENSION GUIDE LINES (Dashed) -->
                    <!-- Top -->
                    <line x1="100" y1="60" x2="100" y2="100" class="fp-dashed"/>
                    <line x1="295" y1="60" x2="295" y2="100" class="fp-dashed"/>
                    <line x1="325" y1="60" x2="325" y2="100" class="fp-dashed"/>
                    <line x1="520" y1="60" x2="520" y2="100" class="fp-dashed"/>
                    
                    <!-- Left -->
                    <line x1="60" y1="100" x2="100" y2="100" class="fp-dashed"/>
                    <line x1="60" y1="170" x2="100" y2="170" class="fp-dashed"/>
                    <line x1="60" y1="510" x2="100" y2="510" class="fp-dashed"/>
                    <line x1="60" y1="580" x2="100" y2="580" class="fp-dashed"/>
                    
                    <!-- Right (Toilet bounds & Cutout length) -->
                    <line x1="520" y1="430" x2="550" y2="430" class="fp-dashed"/>
                    <line x1="520" y1="510" x2="550" y2="510" class="fp-dashed"/>
                    <line x1="340" y1="580" x2="550" y2="580" class="fp-dashed"/>
                    
                    <!-- Bottom -->
                    <line x1="100" y1="580" x2="100" y2="630" class="fp-dashed"/>
                    <line x1="340" y1="580" x2="340" y2="630" class="fp-dashed"/>

                    <!-- ACTUAL DIMENSION LINES -->
                    <!-- Top -->
                    <line x1="100" y1="60" x2="295" y2="60" class="fp-dim-line"/>
                    <text x="197.5" y="55" class="fp-dim-text">19m</text>
                    
                    <text x="310" y="55" class="fp-dim-text" font-size="9">3m Entrance</text>

                    <line x1="325" y1="60" x2="520" y2="60" class="fp-dim-line"/>
                    <text x="422.5" y="55" class="fp-dim-text">19m</text>

                    <!-- Left -->
                    <line x1="60" y1="100" x2="60" y2="170" class="fp-dim-line"/>
                    <line x1="55" y1="100" x2="65" y2="100" class="fp-dim-line"/>
                    <line x1="55" y1="170" x2="65" y2="170" class="fp-dim-line"/>
                    <text x="45" y="138" class="fp-dim-text">7m</text>
                    
                    <line x1="60" y1="170" x2="60" y2="510" class="fp-dim-line"/>
                    <line x1="55" y1="510" x2="65" y2="510" class="fp-dim-line"/>
                    <text x="45" y="340" class="fp-dim-text" transform="rotate(-90 45 340)">34m</text>

                    <line x1="60" y1="510" x2="60" y2="580" class="fp-dim-line"/>
                    <line x1="55" y1="580" x2="65" y2="580" class="fp-dim-line"/>
                    <text x="45" y="545" class="fp-dim-text" transform="rotate(-90 45 545)">7m</text>

                    <!-- Right -->
                    <line x1="550" y1="430" x2="550" y2="510" class="fp-dim-line"/>
                    <line x1="545" y1="430" x2="555" y2="430" class="fp-dim-line"/>
                    <line x1="545" y1="510" x2="555" y2="510" class="fp-dim-line"/>
                    <text x="565" y="473" class="fp-dim-text" text-anchor="start">8m</text>
                    
                    <line x1="550" y1="510" x2="550" y2="580" class="fp-dim-line"/>
                    <line x1="545" y1="580" x2="555" y2="580" class="fp-dim-line"/>
                    <text x="565" y="548" class="fp-dim-text" text-anchor="start">7m</text>

                    <!-- Bottom -->
                    <line x1="100" y1="630" x2="340" y2="630" class="fp-dim-line"/>
                    <line x1="100" y1="625" x2="100" y2="635" class="fp-dim-line"/>
                    <line x1="340" y1="625" x2="340" y2="635" class="fp-dim-line"/>
                    <text x="220" y="650" class="fp-dim-text">24m</text>

                    <!-- Inner Dimensions (Inside Lobby below dashed separator) -->
                    <!-- Wait, inside lobby 7m marker is above the dashed line. I adjusted Y to 150 (above 170) -->
                    <line x1="100" y1="150" x2="170" y2="150" class="fp-line" stroke="#6a6a6a" stroke-width="0.5"/>
                    <line x1="100" y1="147" x2="100" y2="153" class="fp-line" stroke="#6a6a6a"/>
                    <line x1="170" y1="147" x2="170" y2="153" class="fp-line" stroke="#6a6a6a"/>
                    <text x="135" y="145" class="fp-dim-text" font-size="9">7m</text>

                    <line x1="450" y1="150" x2="520" y2="150" class="fp-line" stroke="#6a6a6a" stroke-width="0.5"/>
                    <line x1="450" y1="147" x2="450" y2="153" class="fp-line" stroke="#6a6a6a"/>
                    <line x1="520" y1="147" x2="520" y2="153" class="fp-line" stroke="#6a6a6a"/>
                    <text x="485" y="145" class="fp-dim-text" font-size="9">7m</text>

                    <!-- Compass Rose -->
                    <g transform="translate(580, 140)">
                        <line x1="0" y1="-25" x2="0" y2="25" stroke="#f0ede8" stroke-width="0.8"/>
                        <line x1="-25" y1="0" x2="25" y2="0" stroke="#f0ede8" stroke-width="0.8"/>
                        <polygon points="0,-25 -4,-18 4,-18" fill="#f0ede8"/>
                        <text x="0" y="-30" class="fp-dim-text" fill="#f0ede8" font-size="11" font-weight="bold">N</text>
                        <text x="0" y="40" class="fp-dim-text" font-size="8">S</text>
                        <text x="-32" y="3" class="fp-dim-text" font-size="8">W</text>
                        <text x="32" y="3" class="fp-dim-text" font-size="8">E</text>
                    </g>
                </svg>
            </div>

            <!-- Legend -->
            <div class="fp-legend">
                <div class="fp-legend-item">
                    <div class="fp-legend-swatch" style="background: #d63a2a;"></div>
                    Theatre
                </div>
                <div class="fp-legend-item">
                    <div class="fp-legend-swatch" style="background: #b87333;"></div>
                    Food Zone
                </div>
                <div class="fp-legend-item">
                    <div class="fp-legend-swatch" style="background: #3b77a8;"></div>
                    Lobby
                </div>
                <div class="fp-legend-item">
                    <div class="fp-legend-swatch" style="background: #13261a;"></div>
                    Toilet
                </div>
                <div class="fp-legend-item">
                    <div class="fp-legend-swatch" style="border: 1px solid #6a6a6a; background: transparent;"></div>
                    Ticket Counter
                </div>
            </div>

            <!-- Scale note -->"""

new_content = re.sub(
    re.escape(start_marker) + r".*?" + re.escape(end_marker),
    replacement,
    content,
    flags=re.DOTALL
)

with open("stryde.html", "w") as f:
    f.write(new_content)
