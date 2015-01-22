
<h2 id =  >
jFlow Framework
</h2>



jFlow, is a model framework for node.js and in the browser, that provides a common component structure for 
maintainable and reusable code with amazing asynchronous flow control.




Installation
------------

For node.js

    npm install jflow-framework

For Browser, download <a href = "https://github.com/Infinitycbs/jflow/archive/master.zip">here</a> and copy `jflow-framework.js` to 
your server's desired path

Usage
-----

For node.js

    require("jflow-framework");

For any browser, in the html header or body footer:

	<script src="..pathto/jflow-framework.js"></script>	

Basic Examples
-----

Asynchronous flow control:

	
	jflow.pause( this,
		
		function( flow ){
			
			console.log("I'm first");		
			flow.wait();
			////		asynchronous call
			setTimeout(function(){
				console.log("I'm second");
				flow.continue();
			}, 200);
		},
		
		function( flow ) {
			console.log("I'm third");
		}
	);		


The console will write:

`I'm first`
	
`I'm second`
	
`I'm third`




	
