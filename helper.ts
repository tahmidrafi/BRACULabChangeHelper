/*------*/
if (!String.prototype.padStart) {
    String.prototype.padStart = function (max, fillString) {
        return padStart(this, max, fillString);
    };
}

function padStart (text, max, mask) {
    const cur = text.length;
    if (max <= cur) {
        return text;
    }
    const masked = max - cur;
    var filler = String(mask) || ' ';
    while (filler.length < masked) {
        filler += filler;
    }
    const fillerSlice = filler.slice(0, masked);
    return fillerSlice + text;
}
/*------*/

function getStudentCount(section_no) {
    var sheet =  SpreadsheetApp.getActive().getSheetByName('Section Changes');
    var data = sheet.getRange("M5:M14").getValues();
    if (section_no > 0 && section_no < 10) {
        return parseInt(data[section_no]);
    }
    return 0;
}

function getTheorySection(std_id) {
    for( var j=1; j<= 11; j++) {
        var sheetname = "Sec " + j.toString().padStart(2, '0');
        var sheet1 = SpreadsheetApp.getActive().getSheetByName(sheetname);
        var textFinder = sheet1.createTextFinder(std_id);
        var firstOccurrence = textFinder.findNext();
        if (firstOccurrence) {
            Logger.log(std_id + ": " + sheetname)
            return j;
        }
    }
    return null;
}

function myFunction() {
    var section_change_sheet = SpreadsheetApp.getActive().getSheetByName('Section Changes');
    var data = section_change_sheet.getRange("B2:D83").getValues();
    for (var i = 1; i < 10; i++) {
        Logger.log("Sec " + i + " Student Count: " + getStudentCount(i));
    }
  
    for (var i = 0; i < data.length; i++) {
        // For each student find their current section
        var theory = getTheorySection(data[i][0]);
        section_change_sheet.getRange(2+i, 8).setValue(theory);
    }
}

function getSourceRow(student_id, theory) {
    var section_sheet_name = "Sec " + theory.toString().padStart(2, '0');
    var section_sheet =  SpreadsheetApp.getActive().getSheetByName(section_sheet_name);
  
    var textFinder = section_sheet.createTextFinder(student_id);
    var firstOccurrence = textFinder.findNext().getRow();
    if (firstOccurrence) {
        return firstOccurrence | 0;
    }
    return null;
}

function getDestRow(section_students, dest_sheet_no) {
    return section_students[dest_sheet_no-1]+5;
}

function movestudents() {
    var section_students = [39, 38, 34, 40, 44, 46, 40, 43, 40];
    var section_change_sheet =  SpreadsheetApp.getActive().getSheetByName('Section Changes');
  
    var data = section_change_sheet.getRange("B2:E89").getValues();
  
    var moved_to_style = section_change_sheet.getRange(20, 10).getTextStyle();
    var moved_to_background = section_change_sheet.getRange(20, 10).getBackground();
    var moved_from_style = section_change_sheet.getRange(21, 10).getTextStyle();
    var moved_from_background = section_change_sheet.getRange(21, 10).getBackground();
  
    for (var i = 0; i < data.length; i++) {
        // For each student find their current section
        var student_id = data[i][0];
        var source_sheet_no = data[i][2];
        var source_sheet_name = "Sec " + source_sheet_no.toString().padStart(2, '0');
        var dest_sheet_no = data[i][3];
        var dest_sheet_name = "Sec " + dest_sheet_no.toString().padStart(2, '0');
        var source_row = getSourceRow(student_id, source_sheet_no);
        var dest_row = getDestRow(section_students, dest_sheet_no);
        Logger.log("Student " + student_id + "; From row " + source_row + " of `" + source_sheet_name + "`; To row " + dest_row + " of `" + dest_sheet_name + "`");
      
        var source_sheet =  SpreadsheetApp.getActive().getSheetByName(source_sheet_name);
        var dest_sheet =  SpreadsheetApp.getActive().getSheetByName(dest_sheet_name);
        
        source_sheet.getRange(source_row, 1).setValue("S"+ dest_sheet_no.toString().padStart(2, '0'));
        dest_sheet.getRange(dest_row, 1).setValue("S"+ source_sheet_no.toString().padStart(2, '0'));
      
        var values = source_sheet.getRange(source_row, 2, 1, 2).getValues();
        Logger.log(values);
        dest_sheet.getRange(dest_row, 2, 1, 2).setValues(values);
        
        var strings = [[]];
        for (var z = 1; z <= 15; z++) {
            var s = "='" + dest_sheet_name + "'!" + String.fromCharCode(67 + z) + dest_row;
            strings[0].push(s);
        }
        
        source_sheet.getRange(source_row, 4, 1, 15).setValues(strings);
      
        source_sheet.getRange(source_row, 1, 1, 19).setTextStyle(moved_to_style).setBackground(moved_to_background);
        dest_sheet.getRange(dest_row, 1, 1, 19).setTextStyle(moved_from_style).setBackground(moved_from_background);

        section_students[dest_sheet_no-1] += 1;

    }
}

function dummy()
{
    var section_change_sheet =  SpreadsheetApp.getActive().getSheetByName('Section Changes');
    var range = section_change_sheet.getRange(20, 10);
    Logger.log(range.getValue());
    var style = range.getTextStyle();
    var background = range.getBackground();
    section_change_sheet.getRange(25, 10).setTextStyle(style).setBackground(background);
}
