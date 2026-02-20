# routes/analyze.py

from fastapi import APIRouter, UploadFile, File, Form
from typing import List
from datetime import datetime
import uuid

from app.services.vcf_parser import parse_vcf
from app.services.gene_extractor import extract_genes
from app.services.phenotype_mapper import determine_phenotype
from app.services.risk_engine import classify_risk, DRUG_GENE_MAP
from app.services.llm_service import generate_explanation

router = APIRouter()


@router.post("/analyze")
async def analyze_vcf(
    file: UploadFile = File(...),
    drugs: List[str] = Form(...)   # ✅ CHANGED: now supports multiple drugs
):

    # ================= FILE TYPE VALIDATION =================
    if not file.filename.endswith(".vcf"):
        return {"error": "Only VCF files are allowed."}

    # ================= READ FILE =================
    file_content = await file.read()

    # ================= PARSE VCF =================
    variants = parse_vcf(file_content)

    # ================= EXTRACT GENES =================
    gene_variants = extract_genes(variants)

    results = []

    # ================= LOOP THROUGH ALL DRUGS =================
    for drug in drugs:

        drug = drug.strip().upper()
        primary_gene = DRUG_GENE_MAP.get(drug)

        if not primary_gene:
            continue  # skip unknown drugs

        gene_data = gene_variants.get(primary_gene, {
            "genotypes": [],
            "rsids": []
        })

        # ================= DETERMINE PHENOTYPE =================
        phenotype = determine_phenotype(
            primary_gene,
            gene_data.get("genotypes", [])
        )

        # ================= CLASSIFY RISK =================
        risk_result = classify_risk(
            drug,
            primary_gene,
            phenotype
        )

        # ================= LLM EXPLANATION =================
        explanation = generate_explanation({
            "drug": drug,
            "gene": primary_gene,
            "phenotype": phenotype,
            "recommendation": risk_result["recommendation"]
        })

        result_object = {
            "patient_id": f"PATIENT_{uuid.uuid4().hex[:6]}",
            "drug": drug,
            "timestamp": datetime.utcnow().isoformat(),

            "risk_assessment": {
                "risk_label": risk_result["risk_label"],
                "confidence_score": risk_result["confidence_score"],
                "severity": risk_result["severity"]
            },

            "pharmacogenomic_profile": {
                "primary_gene": primary_gene,
                "diplotype": "*1/*1" if phenotype == "NM" else "Variant detected",
                "phenotype": phenotype,
                "detected_variants": [
                    {"rsid": rsid}
                    for rsid in gene_data.get("rsids", [])
                ]
            },

            "clinical_recommendation": {
                "recommendation": risk_result["recommendation"]
            },

            "llm_generated_explanation": {
                "summary": explanation
            },

            # ✅ FIXED quality metric logic
            "quality_metrics": {
                "vcf_parsing_success": True,
                "gene_detected": phenotype not in ["Unknown", None]
            }
        }

        results.append(result_object)

    return {
        "results": results
    }