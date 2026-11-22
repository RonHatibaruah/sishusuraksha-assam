import os
import re
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from reportlab.pdfgen import canvas

base_dir = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(base_dir, 'assets', 'proposal_images')

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Government of Assam • Health & Family Welfare Dept • NESFIC-D-26")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "SishuSuraksha (Assam Sick Newborn Sentinel) — Ron Hatibaruah")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "NESFIC 2026 Proposal • Problem NESFIC-D-26 • Applicant: Ron Hatibaruah")
        self.drawRightString(letter[0] - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def clean_inline_markdown(text):
    if not text:
        return ""
    t = text.strip()
    
    code_matches = []
    def save_code(m):
        code_matches.append(m.group(1))
        return f"___CODE_MATCH_{len(code_matches)-1}___"
    
    t = re.sub(r'`([^`]+)`', save_code, t)
    
    # Escape XML
    t = escape(t)
    
    # Bold italic
    t = re.sub(r'\*\*\*([^*]+)\*\*\*', r'<b><i>\1</i></b>', t)
    t = re.sub(r'___([^_]+)___', r'<b><i>\1</i></b>', t)
    
    # Bold
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'__([^_]+)__', r'<b>\1</b>', t)
    
    # Italic
    t = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', t)
    t = re.sub(r'_([^_]+)_', r'<i>\1</i>', t)
    
    # Links
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<font color="#0284c7"><u>\1</u></font>', t)
    
    # Restore code
    for idx, c in enumerate(code_matches):
        c_esc = escape(c)
        t = t.replace(f"___CODE_MATCH_{idx}___", f'<font name="Courier" color="#be123c">{c_esc}</font>')
        
    return t

def safe_paragraph(text, style):
    cleaned = clean_inline_markdown(text)
    try:
        return Paragraph(cleaned, style)
    except Exception:
        plain = re.sub(r'<[^>]+>', '', cleaned)
        return Paragraph(escape(plain), style)

def parse_markdown_content(lines, available_width=490):
    styles = getSampleStyleSheet()
    
    body_style = ParagraphStyle(
        'ParsedBody', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11,
        textColor=colors.HexColor('#1e293b'), spaceAfter=3
    )
    bullet_style = ParagraphStyle(
        'ParsedBullet', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11,
        textColor=colors.HexColor('#1e293b'), leftIndent=12, firstLineIndent=-8, spaceAfter=2
    )
    h3_style = ParagraphStyle(
        'ParsedH3', parent=styles['Heading3'], fontName='Helvetica-Bold', fontSize=9, leading=12,
        textColor=colors.HexColor('#881337'), spaceBefore=4, spaceAfter=2, keepWithNext=True
    )
    table_cell = ParagraphStyle(
        'TCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7, leading=9.5,
        textColor=colors.HexColor('#0f172a')
    )
    table_hdr = ParagraphStyle(
        'THdr', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7, leading=9.5,
        textColor=colors.white
    )

    flowables = []
    in_table = False
    table_rows = []
    
    for line in lines:
        stripped = line.strip()
        
        # Detect markdown table
        if stripped.startswith('|') and stripped.endswith('|'):
            # Check if divider
            if re.match(r'^\|?[\s\-:|]+\|?$', stripped):
                continue
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            table_rows.append(cells)
            in_table = True
            continue
        else:
            if in_table and table_rows:
                num_cols = len(table_rows[0])
                col_w = available_width / float(num_cols)
                t_data = []
                for r_idx, r in enumerate(table_rows):
                    row_cells = []
                    for c in r:
                        st = table_hdr if r_idx == 0 else table_cell
                        row_cells.append(safe_paragraph(c, st))
                    t_data.append(row_cells)
                t = Table(t_data, colWidths=[col_w]*num_cols)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#881337')),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
                ]))
                flowables.append(t)
                flowables.append(Spacer(1, 4))
                in_table = False
                table_rows = []
        
        if not stripped:
            continue
            
        if stripped.startswith('### '):
            flowables.append(safe_paragraph(stripped[4:], h3_style))
        elif stripped.startswith('• ') or stripped.startswith('- ') or stripped.startswith('* '):
            flowables.append(safe_paragraph(stripped, bullet_style))
        elif re.match(r'^\d+\.\s', stripped):
            flowables.append(safe_paragraph(stripped, bullet_style))
        elif stripped.startswith('> '):
            callout_style = ParagraphStyle(
                'Callout', parent=body_style, fontName='Helvetica-Oblique',
                textColor=colors.HexColor('#881337'), leftIndent=12, rightIndent=12
            )
            flowables.append(safe_paragraph(stripped[2:], callout_style))
        else:
            flowables.append(safe_paragraph(stripped, body_style))
            
    # Flush leftover table
    if in_table and table_rows:
        num_cols = len(table_rows[0])
        col_w = available_width / float(num_cols)
        t_data = []
        for r_idx, r in enumerate(table_rows):
            row_cells = []
            for c in r:
                st = table_hdr if r_idx == 0 else table_cell
                row_cells.append(safe_paragraph(c, st))
            t_data.append(row_cells)
        t = Table(t_data, colWidths=[col_w]*num_cols)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#881337')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
        ]))
        flowables.append(t)
        flowables.append(Spacer(1, 4))
        
    return flowables

def build_proposal_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=15, leading=19,
        textColor=colors.HexColor('#881337'), alignment=0, spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12.5,
        textColor=colors.HexColor('#be123c'), spaceAfter=4
    )
    meta_style = ParagraphStyle(
        'MetaStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#334155')
    )
    h2_style = ParagraphStyle(
        'H2Style', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11, leading=14.5,
        textColor=colors.HexColor('#881337'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )

    story = []
    story.append(safe_paragraph("NESFIC 2026 UNIFORM SOLUTION PROPOSAL (USPR)", title_style))
    story.append(safe_paragraph("SishuSuraksha (শিশু-সুৰক্ষা) — Assam Sick Newborn Care Continuum & Referral Sentinel", subtitle_style))
    story.append(safe_paragraph("<b>Official 12-Field Application Dossier for Stream 1 (Government Department Track)</b>", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-26 (Govt Track)", meta_style), safe_paragraph("<b>Department:</b> Health & Family Welfare Department, Govt. of Assam", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Ron Hatibaruah", meta_style), safe_paragraph("<b>Format:</b> Official Proposal Submission (PDF < 10 MB)", meta_style)],
        [safe_paragraph("<b>Live Prototype:</b> https://sishusuraksha-assam.pages.dev/", meta_style), safe_paragraph("<b>Technical Synergy:</b> National Health Mission (NHM) Assam", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff1f2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fda4af')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    # Read proposal_contents.md
    prop_path = os.path.join(base_dir, 'proposal_contents.md')
    with open(prop_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by Field and Supporting Material
    sections = re.split(r'\n## (Field \d+:.*?|03 Supporting Material.*?)\n', content)
    
    for i in range(1, len(sections), 2):
        sec_hdr = sections[i].strip()
        sec_body = sections[i+1].strip()
        
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#fda4af"), spaceBefore=6, spaceAfter=4))
        story.append(safe_paragraph(sec_hdr, h2_style))
        
        lines = sec_body.split('\n')
        body_flowables = parse_markdown_content(lines, available_width=504)
        story.extend(body_flowables)

        # Append relevant architectural diagrams after specific fields
        if 'Field 1:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_1_before_after_workflow.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 2:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_5_facility_bed_radar.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 3:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_3_clinical_triage_decision_tree.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 4:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_2_system_architecture.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 6:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_8_rollout_roadmap_procurement.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 7:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_4_geospatial_referral_pipeline.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 9:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_6_hbnc_continuity_growth.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))
        elif 'Field 11:' in sec_hdr:
            img = os.path.join(img_dir, 'diagram_7_vernacular_caregiver_advisory.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 6))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

def build_proof_of_work_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=15, leading=19,
        textColor=colors.HexColor('#881337'), alignment=0, spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12.5,
        textColor=colors.HexColor('#be123c'), spaceAfter=4
    )
    meta_style = ParagraphStyle(
        'MetaStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#334155')
    )
    h2_style = ParagraphStyle(
        'H2Style', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11, leading=14.5,
        textColor=colors.HexColor('#881337'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )

    story = []
    story.append(safe_paragraph("NESFIC 2026 PROOF OF WORK & TECHNICAL DOSSIER", title_style))
    story.append(safe_paragraph("SishuSuraksha: Algorithmic Bedside Triage, Bed Capacity Radar & Closed-Loop HBNC Continuum", subtitle_style))
    story.append(safe_paragraph("<b>Technical Architecture, Mathematical Formulations, Validation Data & Field Case Studies</b>", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-26 (Govt Track)", meta_style), safe_paragraph("<b>Department:</b> Health & Family Welfare Department, Govt. of Assam", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Ron Hatibaruah", meta_style), safe_paragraph("<b>Classification:</b> Production-Grade Working Prototype", meta_style)],
        [safe_paragraph("<b>Live Prototype:</b> https://sishusuraksha-assam.pages.dev/", meta_style), safe_paragraph("<b>Code Repository:</b> https://github.com/RonHatibaruah/sishusuraksha-assam", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff1f2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fda4af')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    pow_path = os.path.join(base_dir, 'proof_of_work_dossier.md')
    with open(pow_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by ## Section
    sections = re.split(r'\n## (\d+\..*?)\n', content)
    
    for i in range(1, len(sections), 2):
        sec_title = sections[i].strip()
        sec_body = sections[i+1].strip()

        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#fda4af"), spaceBefore=6, spaceAfter=4))
        story.append(safe_paragraph(sec_title, h2_style))
        
        lines = sec_body.split('\n')
        
        # Attach diagrams inside sections
        if '1. Executive Summary' in sec_title:
            img = os.path.join(img_dir, 'diagram_1_before_after_workflow.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 5))
        elif '2. Mathematical Formulations' in sec_title:
            img = os.path.join(img_dir, 'diagram_3_clinical_triage_decision_tree.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 5))
        elif '3. Empirical Model Benchmarks' in sec_title:
            img = os.path.join(img_dir, 'diagram_5_facility_bed_radar.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 5))
        elif '4. Real-World Field Case Studies' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_4_geospatial_referral_pipeline.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=504, height=283.5))
                story.append(Spacer(1, 5))
            img2 = os.path.join(img_dir, 'diagram_6_hbnc_continuity_growth.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=504, height=283.5))
                story.append(Spacer(1, 5))
        elif '5. System Architecture' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_2_system_architecture.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=504, height=283.5))
                story.append(Spacer(1, 5))
            img2 = os.path.join(img_dir, 'diagram_7_vernacular_caregiver_advisory.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=504, height=283.5))
                story.append(Spacer(1, 5))
        elif '6. Security, Compliance' in sec_title:
            img = os.path.join(img_dir, 'diagram_8_rollout_roadmap_procurement.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=504, height=283.5))
                story.append(Spacer(1, 5))

        body_flowables = parse_markdown_content(lines, available_width=504)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

if __name__ == '__main__':
    proposal_pdf = os.path.join(base_dir, 'NESFIC_D26_Proposal_Ron_Hatibaruah.pdf')
    pow_pdf = os.path.join(base_dir, 'NESFIC_D26_Proof_of_Work_Ron_Hatibaruah.pdf')
    
    build_proposal_pdf(proposal_pdf)
    build_proof_of_work_pdf(pow_pdf)
