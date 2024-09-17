// export default function exportPdf(fileName="trips") {
//     import('jspdf').then((jsPDF) => {
//         import('jspdf-autotable').then(() => {
//             const doc = new jsPDF.default(0, 0);

//             doc.autoTable(exportColumns, fileName);
//             doc.save('fileName.pdf');
//         });
//     });
// }
export default function exportPdf(fileName = "trips") {
    import('jspdf').then((jspdf) => {
        import('jspdf-autotable').then((jspdfAutotable) => {
            const doc = new jspdf.default(0, 0);

            doc.autoTable(exportColumns, fileName);
            doc.save(`${fileName}.pdf`);
        });
    });
}