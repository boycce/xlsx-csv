use calamine::{open_workbook_auto, DataType, Range, Reader};
use std::env;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::PathBuf;

fn main() {
    let file = env::args()
        .nth(1)
        .expect("Please provide an excel file to convert");

    let mut sheet = env::args().nth(2);
    let keep_newlines = env::args().nth(3).unwrap_or("false".to_string());

    let sce = PathBuf::from(file);
    match sce.extension().and_then(|s| s.to_str()) {
        Some("xlsx") | Some("xlsm") | Some("xlsb") | Some("xls") => (),
        _ => panic!("Expecting an excel file"),
    }

    let dest = sce.with_extension("csv");
    let mut dest = BufWriter::new(File::create(dest).unwrap());
    let mut xl = open_workbook_auto(&sce).unwrap();

    if sheet.is_none() {
        sheet = xl.sheet_names().first().cloned();
    }

    let range = xl.worksheet_range(&sheet.unwrap()).unwrap().unwrap();

    write_range(&mut dest, &range, keep_newlines).unwrap();
}

fn write_range<W: Write>(dest: &mut W, range: &Range<DataType>, keep_newlines: String) -> std::io::Result<()> {
    let column_count = range.get_size().1;
    let start_row = range.start().unwrap().0;

    // Add any empty rows at the top
    for _row in (0..start_row).enumerate() {
      for (index, _cell) in (0..column_count).enumerate() {
        if index != column_count - 1 {
          write!(dest, ",")?;
        }
      }
      write!(dest, "\r\n")?;
    }

    for (_row_index, row) in range.rows().enumerate() {
        for (cell_index, cell) in row.iter().enumerate() {
            match *cell {
                DataType::Empty => Ok(()),
                DataType::String(ref _s) => {
                  let has_double_quotes = _s.contains('"');
                  let has_comma = _s.contains(',');
                  let has_line_breaks1 = _s.contains("\r");
                  let has_line_breaks2 = _s.contains("\n");
                  let mut s2 = _s.to_owned();

                  if has_double_quotes {
                    s2 = s2.replace("\"", "\"\"");
                  }
                  if (has_line_breaks1 || has_line_breaks2) && keep_newlines != "true" {
                    s2 = s2.replace("\r\n", " ");
                    s2 = s2.replace("\n", " ");
                    s2 = s2.replace("\r", " ");
                  }
                  if has_double_quotes || has_line_breaks1 || has_line_breaks2 || has_comma {
                    let s3 = "\"".to_owned();
                    s2 = s3 + &s2 + "\"";
                  }
                  write!(dest, "{}", s2)
                }
                DataType::Float(ref f) => write!(dest, "{}", f),
                DataType::DateTime(ref _f) => {

                    // Format as DD/MM/YY
                    write!(dest, "{}", DataType::as_date(cell).unwrap().format("%d/%m/%y"))
                }
                DataType::Int(ref i) => write!(dest, "{}", i),
                DataType::Error(ref e) => write!(dest, "{:?}", e),
                DataType::Bool(ref b) => write!(dest, "{}", b),
            }?;
            if cell_index != column_count - 1 {
                write!(dest, ",")?;
            }
        }
        write!(dest, "\r\n")?;
    }
    Ok(())
}
