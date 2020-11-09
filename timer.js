self.addEventListener('message', function(e){
    setTimeout(function() {
        self.postMessage("Worker finished");
    }, Math.floor(Math.random() * 5000) + 1000);     
});
