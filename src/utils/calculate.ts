export const calculateHandPercent = (data: number, selection_speed: number, ver: number, selection: number): number => {
    let result = 99;
    if (selection == 0 && (ver >= 4.42 || (ver >= 3.42 && ver < 4))) {
      result = parseFloat(data.toFixed(1));
    } else if (selection == 0 || ver < 2.5) {
      result = parseFloat(data.toFixed(0));
    } else if (selection == 1 && ver >= 2.5) {
      result = parseFloat((selection_speed * data * 0.05).toFixed(2));
    }
  
    return result;
  };