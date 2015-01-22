

jFlow Framework, is a model framework for node.js and in the browser. It provides a common component structure for 
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

Asynchronous Flow Control
-----
<h4 >
Basic Example
</h4>


	//  This event will cause the first function segment to wait until
	//  the setTimeout event is complete
	jflow.pause( this,
		//  first function-segment
		function( flow ){
			
			console.log("I'm first");		
			flow.wait();
			//  asynchronous call
			setTimeout(function(){
				console.log("I'm second");
				flow.continue();
			}, 200);
		},
		//  second function-segment
		function( flow ) {
			console.log("I'm third");
		}
	);		


The console will write:

`I'm first`
	
`I'm second`
	
`I'm third`

<h4 >
Flow-enabled function
</h4>


	//  create a flow-enabled function
	function iCanPause(){
		jflow.pause( this,
			//  function-segment
			function( flow ){
				flow.wait();
				//  asynchronous call
				setTimeout(function(){
					console.log("I'm second");
					
					flow.continue();
				}, 200);
			}, 
			//  function-segment
			function( flow ) {
				return;
			}
		);
	}
	
	//  start a pause event
	jflow.pause( this,
		//  the first function-segment
		function( flow ){
			console.log("I'm first");		
			//  flow-enabled function
			iCanPause();
		},
		
		//  the third function-segment
		//  this function will not execute until iCanPause() is complete
		function( flow ) {
			 
			console.log("I'm Third");
		}
	);

For a complete explanination and to explore the full potential of the pause() event, 
<a href = "http://www.infinitycbs.com/jflow/doc/tutorial-pause.html">look here</a>

Components
-----

	
