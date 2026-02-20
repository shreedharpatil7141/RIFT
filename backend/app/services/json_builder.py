# build_response.py

from datetime import datetime, timezone

timestamp = datetime.now(timezone.utc).isoformat()
import uuid


# ---- Allowed ENUMS (STRICT) ----

ALLOWED_RISK_LABELS = {
    "Safe",
    "Adjust Dosage",
    "Toxic",
    "Ineffective",
    "Unknown"
}

ALLOWED_SEVERITY = {
    "none",
    "low",
    "moderate",
    "high",
    "critical",
    "unknown"
}

ALLOWED_PHENOTYPES = {
    "PM",
    "IM",
    "NM",
    "RM",
    "URM",
    "Unknown"
}


def _safe_enum(value, allowed_set, default):
    """
    Ensures value strictly matches allowed enum.
    """
    if value in allowed_set:
        return value
    return default


def build_response(
    drug,
    gene,
    phenotype,
    diplotype,
    rsids,
    risk_data,
    explanation
):

    # ---- Normalize Inputs ----

    drug = (drug or "").strip().upper()
    gene = (gene or "").strip().upper()
    phenotype = phenotype if phenotype in ALLOWED_PHENOTYPES else "Unknown"
    diplotype = diplotype if diplotype else "Unknown"
    rsids = rsids if isinstance(rsids, list) else []

    # ---- Risk Section Enforcement ----

    risk_label = _safe_enum(
        risk_data.get("risk_label"),
        ALLOWED_RISK_LABELS,
        "Unknown"
    )

    severity = _safe_enum(
        risk_data.get("severity"),
        ALLOWED_SEVERITY,
        "unknown"
    )

    confidence_score = float(risk_data.get("confidence_score", 0.0))

    recommendation = risk_data.get(
        "recommendation",
        "No validated pharmacogenomic recommendation available."
    )

    # ---- Strict ISO8601 Timestamp ----
    timestamp = datetime.now(timezone.utc).isoformat()

    # ---- Construct Strict Schema ----

    response = {
        "patient_id": f"PATIENT_{uuid.uuid4().hex[:6]}",
        "drug": drug,
        "timestamp": timestamp,

        "risk_assessment": {
            "risk_label": risk_label,
            "confidence_score": confidence_score,
            "severity": severity
        },

        "pharmacogenomic_profile": {
            "primary_gene": gene,
            "diplotype": diplotype,
            "phenotype": phenotype,
            "detected_variants": [
                {"rsid": str(rs)} for rs in rsids
            ]
        },

        "clinical_recommendation": {
            "recommendation": recommendation
        },

        "llm_generated_explanation": {
            "summary": explanation or ""
        },

        "quality_metrics": {
            "vcf_parsing_success": True,
            "gene_detected": bool(gene)
        }
    }

    return response
