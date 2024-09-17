export default function exportExcel(data,fileName="trips") {
          import('xlsx').then((xlsx) => {
                    const worksheet = xlsx.utils.json_to_sheet(data);
                    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
                    const excelBuffer = xlsx.write(workbook, {
                              bookType: 'xlsx',
                              type: 'array'
                    });

                    saveAsExcelFile(excelBuffer, fileName);
          });
}
const saveAsExcelFile = (buffer, fileName) => {
          import('file-saver').then((module) => {
                    if (module && module.default) {
                              let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                              let EXCEL_EXTENSION = '.xlsx';
                              const data = new Blob([buffer], {
                                        type: EXCEL_TYPE
                              });

                              module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
                    }
          });
};