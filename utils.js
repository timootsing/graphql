const bytesToKB = (bytes) => {
    return (bytes / 1000).toFixed(2);
  }

const bytesToMB = (bytes) => {
    return (bytes / 1000000).toFixed(2);
}

const calculateAge = (dob) => {
    const currentDate = new Date();
    const dobDateTime = new Date(dob);
  
    let age = currentDate.getFullYear() - dobDateTime.getFullYear();
  
    const birthMonth = dobDateTime.getMonth();
    const currentMonth = currentDate.getMonth();
  
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < dobDateTime.getDate())) {
        age--;
    }
  
    return age;
}

const randomRGBValue = () => {
    const red = Math.floor(Math.random() * 200 + 56);
    const green = Math.floor(Math.random() * 200 + 56);
    const blue = Math.floor(Math.random() * 200 + 56);
  
    return `${red}, ${green}, ${blue}`;
}
