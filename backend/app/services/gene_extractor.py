TARGET_GENES = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"]


def extract_genes(variants):

    gene_variants = {}

    for var in variants:
        gene_name = var.get("gene")
        genotype = var.get("genotype")
        rsid = var.get("rsid")

        if gene_name in TARGET_GENES:

            if gene_name not in gene_variants:
                gene_variants[gene_name] = {
                    "genotypes": [],
                    "rsids": []
                }

            if genotype:
                gene_variants[gene_name]["genotypes"].append(genotype)

            if rsid:
                gene_variants[gene_name]["rsids"].append(rsid)

    return gene_variants
