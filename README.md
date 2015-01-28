
jFlow Framework, is a model framework for node.js and in the browser. It provides a common component structure for 
maintainable and reusable code with asynchronous flow control.  Some key features include:

*	Any number of asynchronous functions can be grouped / organised without the need for callbacks.
*	Components contain a reusable structure provided in traditional object oriented programming such as static, public and private members.
*	Extendable component structures (inheritance).
* 	Each component instance returns a unique object, i.e there is no need to use the "new" keyword.

<h1 >
Documentation
</h1>

<h3>
<a href="http://www.infinitycbs.com/jflow/doc" target="_blank" >Complete and comprehensive documentation can be found here</a>
</h3>

<h1 id="Installation">
Installation
</h1 >

For node.js
<pre><code>npm install jflow-framework;</code></pre>

	

For Browser, download <a href = "https://github.com/Infinitycbs/jflow/archive/master.zip">here</a> and copy `jflow-framework.js` to 
your server's desired path
<h1 >
Usage
</h1>


For node.js

	require("jflow-framework");


For the browser, in the HTML header or body footer:

	<script src="..pathto/jflow-framework.js"></script>


By default, the jFlow instance is global


<h2 >
Basic Asynchronous Example
</h2>


	jflow.pause( this,
		
		function( flow ){
			console.log("I'm first");		
			//  start a wait event
			flow.wait();
			//  asynchronous call
			setTimeout(function(){
				console.log("I'm second");
				//  account for the wait event
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


<h2 >
Component Example
</h2>


	//  define a component
	var Foo = function(jflow) {
	   
	   //  define private variable
	   var cantTouchThis = true;
	   
	    //  component definition
	    return {
			// runs when component is initalized
			init: function( value ){
	            // assign public property [value] of given instance
	            this.value = value;
	
	            console.log( "i ran when initalized, i was passed a value of ["+value+"]");
	        },
			
			//  component method
	        do : function() {
	            console.log("I have a value of ["+this.value+"]");
	        }
	    };
	};
	
	//  create static properties
	// Static definition
	Foo.Static = function(jflow) {
		////		object containing the properties you want to assign as static
		return{
			//  Static member
			iamStatic: function(){
				console.log("no instance, just Static");
			}
		};
	};
	
	
	// add component to the framework
	jflow.addComponent("Foo", Foo);
	
	//  run this when jFlow framework is ready
	jflow.ready( function( jflow ){
		
		//  create instance
		var foo = jflow.Foo( "bar" );  
			
		//  console writes : `i ran when initalized, i was passed a value of [bar]`
		
		foo.do();
		
		//  console writes : `I have a value of [bar]`
		
		// this "Foo" is the installed component, not the instance "foo"
		jflow.Foo.iamStatic();
		
		//  console writes : `no instance, just Static`
		
		console.log( foo.cantTouchThis );
		
		//  console writes : undefined
	
	});
