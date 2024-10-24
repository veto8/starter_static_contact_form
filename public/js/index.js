
async function newsletter()  {
    jQuery('#newsletter button').on('click', async function (e) {
      e.preventDefault();
      const form   = document.querySelector('#newsletter');
      const data = formToJSON(jQuery(form));

      if(form.checkValidity() === true)
      {
        let status = document.querySelector('#status2');
        let spinner = document.querySelector('#spinner2');
        jQuery("#status2").show();
        jQuery("#spinner2").show();          
        let r  = await send_data(status,spinner,data);
        //console.log(r);
      }
      form.classList.add('was-validated');
   });
}



async function send_data(status, data)
{
  //console.log(location.hostname);
    let url = data["api"];
    let mail_url = "https://" + location.hostname ; 
    if(location.hostname == '127.0.0.1')
    {
      url = "http://127.0.0.1:8090/booking";
      mail_url = "http://127.0.0.1/cgi-bin/email.cgi";                
    }

  data["date"] = new Date().toISOString().split('T')[0];
  let jqxhr = $.post(url, JSON.stringify(data),function(r)
  {
    if(! r.ok == true) {
      return failsafe_1(status, spinner, data);
    }
    else
    {
      return "ok";          
      //console.log("...success");
    }
 }).done(function() {
      //console.log( "second success" );
      jQuery(status).show();
  })
  .fail(function() {
      //console.log( "error" );
      return failsafe_1(status,spinner,data);
   })
  .always(function() {
      //console.log( "finished" );
      jQuery(spinner).hide();          
  },'json');
    

}

async function failsafe(data){
    //console.log("...fail safe 2");
      let dtxt = "";
      for(let i in data ){
          dtxt += i +':' + data[i] + '\n\r %0D';
      }
    window.location.href = 'mailto:'+ data['mail'] +'?subject=booking_from_'+ data['id'] +'&body='+ dtxt;
    return "ok";
}

