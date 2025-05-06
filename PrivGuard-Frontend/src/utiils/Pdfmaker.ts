import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

(pdfMake as any).vfs = pdfFonts.vfs;

export const exportBreachReport = (data: any) => {
    const breaches = data.ExposedBreaches.breaches_details;

    const docDefinition: TDocumentDefinitions = {
        content: [
            { text: "PrivGuard Breach Exposure Report", style: "header" },
            { text: `Report Summary`, style: "subheader", margin: [0, 10, 0, 0] },
            {
                ul: [
                    `Total Breaches: ${breaches.length}`,
                    `Overall Risk: ${data.BreachMetrics.risk[0]?.risk_label} (${data.BreachMetrics.risk[0]?.risk_score})`,
                    `Sites Breached: ${data.BreachesSummary.site}`,
                ],
            },
            { text: "Detailed Breach List", style: "subheader", margin: [0, 15, 0, 5] },
            ...breaches.map((breach: any, i: number) => ({
                stack: [
                    { text: `${i + 1}. ${breach.breach}`, style: "breachTitle" },
                    { text: `Domain: ${breach.domain}` },
                    { text: `Industry: ${breach.industry}` },
                    { text: `Exposed Data: ${breach.xposed_data}` },
                    { text: `Password Risk: ${breach.password_risk}` },
                    { text: `Date: ${breach.xposed_date}` },
                    { text: `Records Exposed: ${breach.xposed_records.toLocaleString()}` },
                    ...(breach.details
                        ? [{ text: `Details: ${breach.details}`, margin: [0, 0, 0, 10] as [number, number, number, number] }]
                        : []),
                ],
                margin: [0, 5, 0, 5] as [number, number, number, number],
            })),
            { text: "Password Strength Breakdown", style: "subheader", margin: [0, 20, 0, 5] },
            {
                table: {
                    widths: ["*", "*", "*", "*"],
                    body: [
                        ["Easy to Crack", "Plaintext", "Strong Hash", "Unknown"],
                        [
                            data.BreachMetrics.passwords_strength[0].EasyToCrack,
                            data.BreachMetrics.passwords_strength[0].PlainText,
                            data.BreachMetrics.passwords_strength[0].StrongHash,
                            data.BreachMetrics.passwords_strength[0].Unknown,
                        ],
                    ],
                },
            },
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: "center" as const,
            },
            subheader: {
                fontSize: 16,
                bold: true,
            },
            breachTitle: {
                fontSize: 14,
                bold: true,
                margin: [0, 5, 0, 2] as [number, number, number, number],
            },
        },
        defaultStyle: {
            fontSize: 10,
        },
        pageMargins: [40, 60, 40, 60] as [number, number, number, number],
    };

    pdfMake.createPdf(docDefinition).download("breach-report.pdf");
};
