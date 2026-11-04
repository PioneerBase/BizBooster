import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChecklistItem, StatutoryDeadline, BusinessProfile } from '../types/compliance';

export function generateCompliancePdf(
  profile: BusinessProfile,
  checklistItems: ChecklistItem[],
  deadlines: StatutoryDeadline[]
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  });

  const simulatedDate = new Date();
  const dateFormatted = simulatedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = simulatedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate statistics
  const mainItems = checklistItems.filter((i) => i.sectionId !== 'go_no_go');
  const totalCount = mainItems.length;
  const completedCount = mainItems.filter((i) => i.status === 'completed').length;
  const inProgressCount = mainItems.filter((i) => i.status === 'in_progress').length;
  const notStartedCount = mainItems.filter((i) => i.status === 'not_started').length;
  const waivedCount = mainItems.filter((i) => i.status === 'not_applicable').length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Gatekeeper statistics
  const goNoGoItems = checklistItems.filter((i) => i.sectionId === 'go_no_go');
  const goNoGoCompleted = goNoGoItems.filter((i) => i.status === 'completed').length;
  const isGoForLaunch = goNoGoCompleted === goNoGoItems.length && goNoGoItems.length > 0;

  // Primary colors
  const primaryColor: [number, number, number] = [24, 39, 64]; // Deep Maryland navy
  const goldColor: [number, number, number] = [180, 83, 9]; // Amber gold
  const slateText: [number, number, number] = [51, 65, 85];

  // Helper for page headers
  const addPageHeader = (pageTitle: string) => {
    doc.setFillColor(...primaryColor);
    doc.rect(40, 36, 532, 28, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(pageTitle.toUpperCase(), 50, 54);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 215, 235);
    doc.text(`CONFIDENTIAL · LOCAL DEVICE RECORD · ${profile.businessName || 'MARYLAND BUSINESS'}`, 562, 54, { align: 'right' });
  };

  // Helper for page footer
  const totalPagesExp = '{total_pages_count_string}';
  const addPageFooter = (pageNum: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(40, 755, 572, 755);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Generated locally via BizBooster Maryland · Grounded in Maryland Small Business Guide (Nov 2026)',
      40,
      768
    );
    doc.text(`Page ${pageNum}`, 572, 768, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: TITLE & BUSINESS PROFILE & SUMMARY
  // ==========================================

  // Document Title & Banner
  doc.setFillColor(...primaryColor);
  doc.rect(40, 40, 532, 72, 'F');

  // Small Maryland flag accent strip
  doc.setFillColor(...goldColor);
  doc.rect(40, 112, 532, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('STATE OF MARYLAND', 54, 68);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(254, 243, 199);
  doc.text('BIZBOOSTER MARYLAND — SMALL BUSINESS COMPLIANCE RECORD', 54, 88);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated on ${dateFormatted} at ${timeFormatted} · Local Device Record`, 54, 102);

  // Privacy notice callout
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 126, 532, 26, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('LOCAL-ONLY DATA PRIVACY GUARANTEE:', 50, 142);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  doc.text(
    'This record was assembled entirely on your client device. No identification numbers or records were transmitted to any server.',
    228,
    142
  );

  // SECTION 1: BUSINESS PROFILE & JURISDICTION TABLE
  let currentY = 166;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('1. Business Entity & Location Profile', 40, currentY);

  autoTable(doc, {
    startY: currentY + 8,
    margin: { left: 40, right: 40 },
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 4.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 150, fillColor: [248, 250, 252] },
      1: { cellWidth: 382 },
    },
    body: [
      ['Business Legal Name:', profile.businessName || 'Not Specified'],
      ['Industry & Activities:', profile.industry || 'Not Specified'],
      ['Operating Street Address:', profile.operatingAddress || 'Not Specified'],
      [
        'Jurisdiction (County / City):',
        `${profile.countyOrCity}${
          profile.countyOrCity === 'Baltimore City'
            ? ' (Independent City - Special Trader Schedule)'
            : profile.countyOrCity === 'Baltimore County'
            ? ' (Towson County Seat - Distinct from Baltimore City)'
            : ''
        }`,
      ],
      ['Compliance Lead / Manager:', profile.complianceLead || 'Not Specified'],
      ['Target Opening Date:', profile.targetOpeningDate || 'Not Specified'],
      ['SDAT Department ID:', profile.sdatId || 'Pending Filing / Not Logged'],
      ['Federal Employer ID (EIN):', profile.ein || 'Pending Filing / Not Logged'],
      ['Sales & Use Tax Account #:', profile.salesTaxAccount || 'Pending Filing / Not Logged'],
      [
        'Retail Inventory Stock:',
        profile.hasRetailInventory
          ? `Carries Retail Stock (Wholesale Valuation: $${Number(profile.inventoryValuation || 0).toLocaleString()})`
          : 'Service-Only (No retail inventory; exempt from Trader’s License)',
      ],
      [
        'Employee Staffing & Wages:',
        `${profile.employeeCount || 0} Employees (${
          (profile.employeeCount || 0) < 15
            ? 'Small Employer: exempt from 0.45% employer FAMLI share'
            : 'Standard Employer: 0.45% employer FAMLI share applies'
        }) · Est. Quarterly Payroll: $${Number(profile.estimatedQuarterlyWages || 0).toLocaleString()}`,
      ],
    ],
  });

  // SECTION 2: READINESS & GATEKEEPER SUMMARY
  const finalProfileTable = (doc as any).lastAutoTable;
  currentY = finalProfileTable.finalY + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('2. Executive Launch Readiness & Gatekeeper Verdict', 40, currentY);

  // Verdict Banner
  doc.setFillColor(isGoForLaunch ? 240 : 254, isGoForLaunch ? 253 : 242, isGoForLaunch ? 244 : 242);
  doc.setDrawColor(isGoForLaunch ? 187 : 254, isGoForLaunch ? 247 : 202, isGoForLaunch ? 208 : 202);
  doc.roundedRect(40, currentY + 8, 532, 42, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(isGoForLaunch ? 21 : 153, isGoForLaunch ? 128 : 27, isGoForLaunch ? 61 : 27);
  doc.text(
    isGoForLaunch ? 'GATEKEEPER VERDICT: CLEARED FOR OPENING' : 'GATEKEEPER VERDICT: HOLD - PENDING REQUIREMENTS',
    52,
    currentY + 24
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateText);
  doc.text(
    isGoForLaunch
      ? `All 5 Opening-Day gates verified. Overall Roadmap Completion: ${completionPct}% (${completedCount}/${totalCount} completed, ${inProgressCount} in progress).`
      : `${goNoGoCompleted} of 5 Opening-Day gates satisfied. Overall Roadmap: ${completionPct}% (${completedCount}/${totalCount} completed, ${inProgressCount} in progress). Do not open without required permits & insurance.`,
    52,
    currentY + 38
  );

  // 5 Opening Day Gates Mini-Table
  autoTable(doc, {
    startY: currentY + 58,
    margin: { left: 40, right: 40 },
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: slateText,
    },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 380 },
      2: { cellWidth: 120, halign: 'center', fontStyle: 'bold' },
    },
    head: [['#', 'Opening-Day Gatekeeper Requirement (Field Guide Page 7)', 'Status']],
    body: goNoGoItems.map((item, idx) => [
      `G0${idx + 1}`,
      item.title,
      item.status === 'completed' ? 'VERIFIED / CLEARED' : 'PENDING ACTION',
    ]),
  });

  addPageFooter(1);

  // ==========================================
  // PAGE 2: MASTER CHECKLIST PROGRESS DETAILS
  // ==========================================
  doc.addPage();
  addPageHeader('Master Startup Checklist & Compliance Audit Log');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('3. Section-by-Section Roadmap & Evidence Retained', 40, 78);

  const checklistRows = mainItems.map((item) => {
    let statusLabel = 'Pending';
    if (item.status === 'completed') statusLabel = 'Completed';
    else if (item.status === 'in_progress') statusLabel = 'In Progress';
    else if (item.status === 'not_applicable') statusLabel = 'Waived / N/A';

    return [
      item.sectionId,
      item.title,
      item.sourceKeys.join(', '),
      item.owner || '—',
      item.dueDate || '—',
      item.notes || '—',
      statusLabel,
    ];
  });

  autoTable(doc, {
    startY: 86,
    margin: { left: 40, right: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 160 },
      2: { cellWidth: 44, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 64 },
      4: { cellWidth: 56, fontStyle: 'bold' },
      5: { cellWidth: 110 },
      6: { cellWidth: 70, halign: 'center', fontStyle: 'bold' },
    },
    head: [['Sec', 'Action Item & Objective', 'Source', 'Owner', 'Due Date', 'Evidence / Binder Notes', 'Status']],
    body: checklistRows,
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        if (data.cell.raw === 'Completed') {
          data.cell.styles.textColor = [21, 128, 61];
          data.cell.styles.fillColor = [240, 253, 244];
        } else if (data.cell.raw === 'In Progress') {
          data.cell.styles.textColor = [180, 83, 9];
          data.cell.styles.fillColor = [254, 243, 199];
        } else if (data.cell.raw === 'Pending') {
          data.cell.styles.textColor = [71, 85, 105];
        } else {
          data.cell.styles.textColor = [148, 163, 184];
        }
      }
    },
  });

  addPageFooter(2);

  // ==========================================
  // PAGE 3: STATUTORY DEADLINES & TAX METRICS
  // ==========================================
  doc.addPage();
  addPageHeader('Statutory Deadlines & Local Tax Compliance Metrics');

  currentY = 78;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('4. Official Filing Deadlines & Regulatory Timetable', 40, currentY);

  const deadlineRows = deadlines.map((dl) => {
    return [
      dl.dateStr,
      dl.program,
      dl.title,
      dl.sourceKey ? `[${dl.sourceKey}] pg.${dl.pdfPage || ''}` : dl.isCustom ? 'Custom Local' : 'State Rule',
      dl.completed ? 'COMPLETED' : dl.isUrgent ? 'URGENT' : 'ACTIVE',
    ];
  });

  autoTable(doc, {
    startY: currentY + 8,
    margin: { left: 40, right: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 4,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { cellWidth: 64, fontStyle: 'bold' },
      1: { cellWidth: 70 },
      2: { cellWidth: 238 },
      3: { cellWidth: 80, halign: 'center' },
      4: { cellWidth: 80, halign: 'center', fontStyle: 'bold' },
    },
    head: [['Due Date', 'Program', 'Statutory Requirement / Event', 'Reference', 'State']],
    body: deadlineRows,
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'COMPLETED') {
          data.cell.styles.textColor = [21, 128, 61];
          data.cell.styles.fillColor = [240, 253, 244];
        } else if (data.cell.raw === 'URGENT') {
          data.cell.styles.textColor = [190, 18, 60];
          data.cell.styles.fillColor = [255, 241, 242];
        }
      }
    },
  });

  const finalDlTable = (doc as any).lastAutoTable;
  currentY = finalDlTable.finalY + 18;

  // SECTION 5: TAX & FEE COMPLIANCE ESTIMATES
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('5. State & Local Tax Compliance Parameters', 40, currentY);

  autoTable(doc, {
    startY: currentY + 8,
    margin: { left: 40, right: 40 },
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: slateText,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 150, fillColor: [248, 250, 252] },
      1: { cellWidth: 382 },
    },
    body: [
      [
        'Circuit Court Trader’s License:',
        profile.hasRetailInventory
          ? `Subject to wholesale bracket ($${Number(profile.inventoryValuation || 0).toLocaleString()}) + $2 Clerk Fee. License Year: May 1 – April 30.`
          : 'Service-Only exemption confirmed (zero wholesale inventory; no Trader’s License required).',
      ],
      [
        'Maryland FAMLI 2027 Contribution:',
        `Total Rate: 0.9% of covered payroll. ${
          (profile.employeeCount || 0) < 15
            ? 'Small Employer Relief Active: Employer share (0.45%) is WAIVED. Remit employee withholding (0.45%) only.'
            : 'Standard Employer: 0.45% employer share + 0.45% employee withholding.'
        } First quarterly wage report due April 30, 2027.`,
      ],
      [
        'Sales and Use Tax Compliance:',
        'Standard Rate: 6.0% (Tangible personal property & digital goods). Alcoholic Beverages: 9.0%. Remittance frequency: Monthly (>$700/mo) or Quarterly ($250-$700/mo).',
      ],
      [
        'SDAT Annual Report & Good Standing:',
        'First Annual Report and Personal Property Return due April 15, 2027 ($300 standard LLC/Corp filing fee). Mandatory even with zero revenue to avoid forfeiture.',
      ],
    ],
  });

  // SIGN-OFF / AUDIT BLOCK
  const finalTaxTable = (doc as any).lastAutoTable;
  currentY = finalTaxTable.finalY + 24;

  if (currentY > 670) {
    doc.addPage();
    addPageHeader('Compliance Verification & Sign-Off');
    currentY = 80;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('6. Compliance Officer Verification & Sign-Off Block', 40, currentY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, currentY + 8, 532, 60, 3, 3, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateText);
  doc.text('I hereby certify that the information and checklist records contained in this dossier reflect the current compliance status of the entity.', 52, currentY + 24);

  doc.line(52, currentY + 54, 240, currentY + 54);
  doc.text('Signature of Compliance Lead / Managing Member', 52, currentY + 64);

  doc.line(280, currentY + 54, 420, currentY + 54);
  doc.text('Printed Name & Title', 280, currentY + 64);

  doc.line(460, currentY + 54, 550, currentY + 54);
  doc.text('Audit Date', 460, currentY + 64);

  addPageFooter(3);

  return doc;
}
