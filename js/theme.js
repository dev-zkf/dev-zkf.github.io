var r = document.querySelector(':root');
function ChangeTheme() {    
    var bgcolor;
    var toggle = true;
    if (toggle == true)
    {
        toggle = false;
        bgolor = "black";
    }
    else
    {
        toggle = true;
        bgcolor = "white";
    }

    r.style.setProperty('--color', bgcolor);
}