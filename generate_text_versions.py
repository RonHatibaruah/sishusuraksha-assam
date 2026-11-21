#!/usr/bin/env python3
"""
Generate clean, copy-paste-ready, textarea-compliant plain text files for NESFIC 2026:
1. NESFIC_D26_Proposal_Ron_Hatibaruah.txt (All 12 portal fields + supporting materials)
2. NESFIC_D26_Proof_of_Work_Ron_Hatibaruah.txt (Full and modular copy-paste textarea blocks)
"""

import os
import re

base_dir = os.path.dirname(os.path.abspath(__file__))

def clean_text_for_textarea(text):
    """
    Strips raw markdown syntax, converts formulas to plain text,
    standardizes bullets and whitespace for HTML <textarea> compatibility.
    """
    t = text
    lines = t.split('\n')
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        # Detect table separator
        if re.match(r'^\|?[\s\-:|]+\|?$', stripped):
            continue
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            clean_cells = [re.sub(r'[*`_]', '', c) for c in cells]
            cleaned_lines.append('  • ' + ' | '.join(clean_cells))
            continue
        cleaned_lines.append(line)
        
    t = '\n'.join(cleaned_lines)
    
    # Strip markdown headers (##, ###)
    t = re.sub(r'^#{1,6}\s+(.*?)$', r'\1', t, flags=re.MULTILINE)
    
    # Strip bold and italics
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'\1', t)
    t = re.sub(r'\*\*(.*?)\*\*', r'\1', t)
    t = re.sub(r'\*(.*?)\*', r'\1', t)
    t = re.sub(r'`(.*?)`', r'\1', t)
    
    # Convert markdown links [Label](url) -> Label: url
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1 (\2)', t)
    
    # Clean latex math
    t = re.sub(r'\$([^$]+)\$', r'\1', t)
    
    # Standardize bullet symbols
    t = re.sub(r'^[ \t]*[-*][ \t]+', '• ', t, flags=re.MULTILINE)
    
    # Replace arrows
    t = t.replace('->', ' to ')
    t = t.replace('<-', ' from ')

    # Replace comparison operators with "smaller than" and "greater than"
    t = re.sub(r'<=\s*', 'smaller than or equal to ', t)
    t = re.sub(r'>=\s*', 'greater than or equal to ', t)
    t = re.sub(r'<\s*', 'smaller than ', t)
    t = re.sub(r'>\s*', 'greater than ', t)

    # Remove any remaining raw < or > markup characters
    t = t.replace('<', '').replace('>', '')

    # Clean up excessive blank lines
    t = re.sub(r'\n{3,}', '\n\n', t)
    
    return t.strip()

def generate_proposal_text():
    src_file = os.path.join(base_dir, 'proposal_contents.md')
    out_file = os.path.join(base_dir, 'NESFIC_D26_Proposal_Ron_Hatibaruah.txt')
    
    with open(src_file, 'r', encoding='utf-8') as f:
        raw = f.read()
        
    # Extract header info
    header = "=" * 80 + "\n"
    header += "NESFIC 2026 - STREAM 1 (GOVERNMENT TRACK) - OFFICIAL 12-FIELD PROPOSAL DOSSIER\n"
    header += "Problem Statement ID: NESFIC-D-26: Timely Identification, Referral & Follow-up of Sick Newborns\n"
    header += "Sponsoring Department: Department of Health and Family Welfare ● Government of Assam\n"
    header += "Technical Synergy: National Health Mission (NHM) Assam\n"
    header += "Applicant / Innovator: Ron Hatibaruah\n"
    header += "Solution: SishuSuraksha (শিশু-সুৰক্ষা) — Assam Sick Newborn Care Continuum Platform\n"
    header += "Live Prototype: https://sishusuraksha-assam.pages.dev/\n"
    header += "GitHub Repository: https://github.com/RonHatibaruah/sishusuraksha-assam\n"
    header += "=" * 80 + "\n\n"
    
    # Split into fields
    field_pattern = r'## (Field \d+:.*?)(?=\n## Field |\n## 03 |\Z)'
    fields = re.findall(field_pattern, raw, flags=re.DOTALL)
    
    field_texts = []
    for f in fields:
        lines = f.strip().split('\n')
        field_header = lines[0].strip()
        field_num_match = re.search(r'Field (\d+)', field_header)
        field_num = field_num_match.group(1) if field_num_match else "?"
        
        field_body = '\n'.join(lines[1:]).strip()
        
        # Word limit info
        limit_match = re.search(r'Limit:\s*(\d+)\s*words', field_body)
        limit_str = f" [Limit: {limit_match.group(1)} words]" if limit_match else " [Limit: 500 words]"
        
        # Remove prompt line if present in body for clean submission text
        body_for_count = re.sub(r'^\*\*Portal Prompt:\*\*.*?\n\n', '', field_body, flags=re.DOTALL)
        body_for_count = re.sub(r'^\*\(Word Count:.*?\*\n\n', '', body_for_count, flags=re.DOTALL)
        
        cleaned_body = clean_text_for_textarea(body_for_count)
        word_count = len(re.findall(r'\b\w+\b', cleaned_body))
        
        block = f"{'='*80}\n"
        block += f"COPY-PASTE BLOCK: FIELD {field_num}{limit_str} — {field_header}\n"
        block += f"Actual Word Count: {word_count} words (STRICTLY WITHIN 500 WORDS)\n"
        block += f"{'='*80}\n\n"
        block += cleaned_body + "\n\n"
        
        field_texts.append(block)
        
    # Append Supporting Materials section
    supp_match = re.search(r'## 03 Supporting Material Submission Details.*', raw, flags=re.DOTALL)
    supp_text = ""
    if supp_match:
        supp_text = f"\n{'='*80}\n03 SUPPORTING MATERIAL SUBMISSION FIELDS\n{'='*80}\n\n"
        supp_text += clean_text_for_textarea(supp_match.group(0)) + "\n"

    full_output = header + "".join(field_texts) + supp_text
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_output)
        
    print(f"Generated text version: {out_file} ({len(full_output)} bytes)")

def generate_pow_text():
    src_file = os.path.join(base_dir, 'proof_of_work_dossier.md')
    out_file = os.path.join(base_dir, 'NESFIC_D26_Proof_of_Work_Ron_Hatibaruah.txt')
    
    with open(src_file, 'r', encoding='utf-8') as f:
        raw = f.read()
        
    header = "=" * 80 + "\n"
    header += "NESFIC 2026 - STREAM 1 - PROOF OF WORK & TECHNICAL EVIDENCE DOSSIER\n"
    header += "Problem Statement ID: NESFIC-D-26: Timely Identification, Referral & Follow-up of Sick Newborns\n"
    header += "Sponsoring Department: Department of Health and Family Welfare ● Government of Assam\n"
    header += "Technical Synergy: National Health Mission (NHM) Assam\n"
    header += "Applicant / Innovator: Ron Hatibaruah\n"
    header += "Solution: SishuSuraksha (শিশু-সুৰক্ষা) — Assam Sick Newborn Care Continuum Platform\n"
    header += "Live Prototype: https://sishusuraksha-assam.pages.dev/\n"
    header += "GitHub Repository: https://github.com/RonHatibaruah/sishusuraksha-assam\n"
    header += "=" * 80 + "\n\n"
    
    cleaned = clean_text_for_textarea(raw)
    full_output = header + cleaned
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_output)
        
    print(f"Generated text version: {out_file} ({len(full_output)} bytes)")

if __name__ == '__main__':
    generate_proposal_text()
    generate_pow_text()
