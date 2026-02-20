# vcf_parser.py
# Responsibility: Read VCF file content (bytes) and extract variant information

def parse_vcf(file_content: bytes):
    variants = []

    # Convert bytes → string
    lines = file_content.decode("utf-8").splitlines()

    for line in lines:
        # Skip metadata
        if line.startswith("##"):
            continue

        # Skip header line
        if line.startswith("#CHROM"):
            continue

        fields = line.strip().split()
        if len(fields) < 10:
            continue

        chrom, pos, rsid, ref, alt, _, _, info, fmt, sample = fields[:10]

        genotype = sample.split(":")[0]  # GT field

        # Extract gene from INFO field
        gene = None
        for item in info.split(";"):
            if item.startswith("GENE="):
                gene = item.split("=")[1]

        variants.append({
            "gene": gene,
            "chrom": chrom,
            "pos": pos,
            "rsid": rsid,
            "ref": ref,
            "alt": alt,
            "genotype": genotype
        })

    return variants
