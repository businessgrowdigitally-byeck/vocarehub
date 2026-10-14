export type CertificateData = {
  name: string | null;
  pathTitles: string[];
  missionTitle: string | null;
  targetPathTitle: string | null;
  targetDate: string | null;
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 70;

function toLatin1(text: string): string {
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    out += code <= 255 ? char : "?";
  }
  return out;
}

export function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\r\n]+/g, " ");
}

function buildContentStream(data: CertificateData): string {
  const ops: string[] = [];
  let y = 760;

  const line = (text: string, font: "F1" | "F2", size: number) => {
    ops.push(`BT /${font} ${size} Tf ${MARGIN_X} ${y} Td (${escapePdfText(text)}) Tj ET`);
    y -= size + 12;
  };
  const gap = (amount: number) => {
    y -= amount;
  };

  line("PASSAPORTE VOCARE", "F2", 26);
  line("Registro pessoal de uma jornada de escolha", "F1", 12);
  gap(18);

  const name = data.name?.trim();
  if (name && name.length > 0) {
    line(`Nome: ${name}`, "F2", 14);
    gap(6);
  }

  line("Caminhos escolhidos", "F2", 14);
  for (const title of data.pathTitles) line(`- ${title}`, "F1", 12);
  gap(12);

  line("Primeiro passo", "F2", 14);
  if (data.missionTitle) line(`Missão: ${data.missionTitle}`, "F1", 12);
  if (data.targetPathTitle) line(`Caminho: ${data.targetPathTitle}`, "F1", 12);
  if (data.targetDate) line(`Data-alvo: ${data.targetDate}`, "F1", 12);
  gap(24);

  line("Documento gerado localmente no seu navegador.", "F1", 10);
  line("Nenhum dado pessoal é armazenado pela VOcare.", "F1", 10);

  return ops.join("\n");
}

export function buildCertificatePdf(data: CertificateData): string {
  const content = toLatin1(buildContentStream(data));
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i] ?? ""}\nendobj\n`;
  }

  const startxref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

  return pdf;
}

export function latin1Bytes(text: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(text.length));
  for (let i = 0; i < text.length; i += 1) bytes[i] = text.charCodeAt(i) & 0xff;
  return bytes;
}
