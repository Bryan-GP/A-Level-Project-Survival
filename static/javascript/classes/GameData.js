
class GameData {
  
  constructor(data){
    this.data = data
    this.url = 'https://FULL-STACK.brysan.repl.co/'
  }
  
  send_data(){
    
    console.log(this.data)
    axios.post(
      this.url, {
        data: this.data
      }).then(response => {
      console.log("done")
    });
  }
}
