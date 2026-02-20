DRUG_GENE_MAP = {
    "CODEINE": "CYP2D6",
    "CLOPIDOGREL": "CYP2C19",
    "WARFARIN": "CYP2C9",
    "SIMVASTATIN": "SLCO1B1",
    "AZATHIOPRINE": "TPMT",
    "FLUOROURACIL": "DPYD"
}
def classify_risk(drug, gene, phenotype):

    drug = (drug or "").strip().upper()
    gene = (gene or "").strip().upper()
    phenotype = (phenotype or "").strip().upper()
    
    # ---------- UNKNOWN PHENOTYPE ----------
    if phenotype in ["", "UNKNOWN", None]:
        return {
            "risk_label": "Unknown",
            "severity": "unknown",
            "confidence_score": 0.3,
            "recommendation": "Genotype detected but phenotype could not be confidently determined. No CPIC-based dosing recommendation available."
        }

    # ================= CODEINE =================
    if drug == "CODEINE" and gene == "CYP2D6":

        if phenotype == "PM":
            return {
                "risk_label": "Ineffective",
                "severity": "moderate",
                "confidence_score": 0.9,
                "recommendation": "Avoid codeine due to insufficient conversion to morphine."
            }

        if phenotype == "IM":
            return {
                "risk_label": "Adjust Dosage",
                "severity": "moderate",
                "confidence_score": 0.85,
                "recommendation": "Consider alternative analgesic or monitor therapeutic response."
            }

        if phenotype == "URM":
            return {
                "risk_label": "Toxic",
                "severity": "high",
                "confidence_score": 0.95,
                "recommendation": "Avoid codeine due to risk of morphine toxicity."
            }

        if phenotype == "NM":
            return {
                "risk_label": "Safe",
                "severity": "low",
                "confidence_score": 0.9,
                "recommendation": "Standard dosing appropriate."
            }

    # ================= CLOPIDOGREL =================
    if drug == "CLOPIDOGREL" and gene == "CYP2C19":

        if phenotype == "PM":
            return {
                "risk_label": "Ineffective",
                "severity": "high",
                "confidence_score": 0.95,
                "recommendation": "Use alternative antiplatelet therapy (e.g., prasugrel or ticagrelor)."
            }

        if phenotype == "IM":
            return {
                "risk_label": "Adjust Dosage",
                "severity": "moderate",
                "confidence_score": 0.85,
                "recommendation": "Consider alternative therapy due to reduced enzymatic activation."
            }

        if phenotype == "NM":
            return {
                "risk_label": "Safe",
                "severity": "low",
                "confidence_score": 0.9,
                "recommendation": "Standard dosing recommended."
            }

    # ================= WARFARIN =================
    if drug == "WARFARIN" and gene == "CYP2C9":

        if phenotype in ["PM", "IM"]:
            return {
                "risk_label": "Adjust Dosage",
                "severity": "high",
                "confidence_score": 0.9,
                "recommendation": "Lower starting dose and monitor INR closely."
            }

        if phenotype == "NM":
            return {
                "risk_label": "Safe",
                "severity": "low",
                "confidence_score": 0.9,
                "recommendation": "Standard dosing appropriate."
            }

    # ================= SIMVASTATIN =================
    if drug == "SIMVASTATIN" and gene == "SLCO1B1":

        if phenotype in ["IM", "PM"]:
            return {
                "risk_label": "Toxic",
                "severity": "moderate",
                "confidence_score": 0.85,
                "recommendation": "Consider lower dose or alternative statin due to myopathy risk."
            }

        if phenotype == "NM":
            return {
                "risk_label": "Safe",
                "severity": "low",
                "confidence_score": 0.9,
                "recommendation": "Standard dosing appropriate."
            }

    # ================= AZATHIOPRINE =================
    if drug == "AZATHIOPRINE" and gene == "TPMT":

        if phenotype == "PM":
            return {
                "risk_label": "Toxic",
                "severity": "critical",
                "confidence_score": 0.95,
                "recommendation": "Avoid azathioprine due to severe myelosuppression risk."
            }

        if phenotype == "IM":
            return {
                "risk_label": "Adjust Dosage",
                "severity": "high",
                "confidence_score": 0.9,
                "recommendation": "Reduce starting dose significantly and monitor blood counts."
            }

        if phenotype == "NM":
            return {
                "risk_label": "Safe",
                "severity": "low",
                "confidence_score": 0.9,
                "recommendation": "Standard dosing recommended."
            }

    # ================= FLUOROURACIL =================
    if drug == "FLUOROURACIL" and gene == "DPYD":

        if phenotype == "PM":
            return {
                "risk_label": "Toxic",
                "severity": "critical",
                "confidence_score": 0.95,
                "recommendation": "Avoid fluorouracil due to life-threatening toxicity."
            }

        if phenotype == "IM":
            return {
                "risk_label": "Adjust Dosage",
                "severity": "high",
                "confidence_score": 0.9,
                "recommendation": "Significant dose reduction required."
            }

        if phenotype == "NM":
            return {
                "risk_label": "Safe",
                "severity": "low",
                "confidence_score": 0.9,
                "recommendation": "Standard dosing appropriate."
            }

    # ================= DEFAULT =================
    return {
        "risk_label": "Unknown",
        "severity": "unknown",
        "confidence_score": 0.4,
        "recommendation": "No validated pharmacogenomic rule available for this drug–gene pair."
    }
