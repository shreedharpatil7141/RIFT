TARGET_GENES = ["CYP2D6","CYP2C19","CYP2C9","SLCO1B1","TPMT","DPYD"]

def extract_target_variants(variants):
    detected = []

    for v in variants:
        for gene in TARGET_GENES:
            if gene in v["info"]:
                detected.append({
                    "gene": gene,
                    "rsid": v["rsid"]
                })

    return detected
