<br/>
jFlow Framework, is a model framework for node.js and in the browser. It provides a common component structure for 
maintainable and reusable code with asynchronous flow control.Some key fetures include:

*	Any number of asynchronous functions can be grouped / organised without the need for callbacks.
*	Components contain a reusable structure provided in traditional object oriented proramming such as static, public and private members.
*	Extendable component structures (inheritance).
* 	Each component instance returns a unique object, i.e there is no need to use the "new" keyword.

<h1 >
Documentation
</h1>

Complete and comprehisive documentation can be found <a href="http://www.infinitycbs.com/jflow/doc" >here</a>


<h1 id="Installation">
Installation
</h1 >

For node.js
<pre><code>npm install jflow-framework
</code></pre>

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
Asynchronous Flow Control
</h2>

jFlow's flow control is used to control the order of various asynchronous activity.  It is
centered around the `jflow.pause()` event, which causes each function listed in is arguments to wait
until all asynchronous activity is complete before is goes on to the next function.
</br></br>
As a point of reference:
* function-segment - is any function in the pause event listed after the first argument.
	


<h3 >
Basic Example
</h3>

Lets begin with a basic example, notice:

* `flow.wait()` event is called. It must be accounted for in order to go on to the next function-segment.
* `flow.continue()` is called. It accounts for the wait event.

<pre><code>
//  This event will cause the first function-segment to wait until
//  the setTimeout event is complete
jflow.pause( this,
	
	//  first function-segment
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
	
	//  second function-segment
	function( flow ) {
		console.log("I'm third");
	}
);		
</code></pre>

The console will write:

`I'm first`
	
`I'm second`
	
`I'm third`


<h3 >
Multiple asynchronous events
</h3>


Now lets add two asynchronous events, notice:
	
* `flow.wait(2)` is called with an argument of `2`. Meaning two wait occurances must be accounted for. 

<pre><code>
//  start a pause event
jflow.pause( this,
	//  the first function-segment
	function( flow ){
		
		console.log("I'm first");		
		//  the wait event is passed a 2, meaning the continue event must be called twice
		flow.wait(2);
		//  asynchronous call
		setTimeout(function(){
			console.log("I'm third");
			//  continue event, accounts for one wait occurance
			flow.continue();
		}, 300);
		//  asynchronous call
		setTimeout(function(){
			console.log("I'm second");
			//  continue event, accounts for one wait occurance
			flow.continue();
		}, 200);
	},
	//  the second function-segment	 
	function( flow ) {
		 
		console.log("I'm fourth");
	}
);		
</code></pre>

The console will write:


`I'm first`
	
`I'm second`
	
`I'm third`
	
`I'm fourth`	



<h3 >
Flow-enabled function
</h3>

Let's create a flow-enabled function and use it:

* A "flow-enabled function" is simply any method that use's the jflow's pause event. Not to be confused with a "function-segment",
which is are arguments passed into the pause event.
* In the second function-segment `flow.wait()` is called once, but there are two asynchronous calls ( `setTimeout` and
 `iCanFlow` ). The second `flow.wait()` event is called in `iCanFlow`. This is because any nested calls to pause enabled functions
 linked together, if you will, and the caller will not move on to the next function-segment until 
the `iCanFlow` pause event is complete.
	
<pre><code>	
//  create a flow-enabled function
function iCanFlow(){
	jflow.pause( this,
		//  function-segment
		function( flow ){
			flow.wait();
				//  asynchronous call
			setTimeout(function(){
				console.log("I'm second");
				//  continue event
				flow.continue();
			}, 200);
		}, 
		//  function-segment
		function( flow ) {
			return true;
		}
	);
}

//  start a pause event
jflow.pause( this,
	//  the first function-segment
	function( flow ){
		
		console.log("I'm first");		
		
		//  call flow-enabled function
		iCanFlow();
		
	},
	//  the third function-segment	
	function( flow ) {
		 
		console.log("I'm last");
	}
);		
</code></pre>

Starting to get the idea? A flow-enabled function can simplify asynchronous routines of varying complexity.

Now lets take the last example and add two more flow-enabled functions, in the following code note:

* Each call to the flow-enabled functions will have a return value.

* In each flow-enabled function, the pause event is returned.

* All returns from a pause event will be an Object.
	* When a function-segment returns any value other than an Object or Array, the pause event will return {result: value}.
	* The value returned in iCanFlow() function-segment is a Boolean of true.The value is automatically converted into {result: true}.
	* The value returned in iAmData() function-segment is an Array. The value is automatically converted into an Object but will retain its structure otherwise. 
	* The value returned in iAmObject() function-segment is an Object. The value returned will be the same type and structure.

  
* returnValue, returnData and returnObject are declared outside the pause event. Alternatively, 
the flow object has a proerty of [store] which you may safely use to pass values from one function-segment to the next.
(i.e `flow.store.someValue = "a string";`)	
	
<pre><code>		
//  create a flow-enabled function
function iCanFlow(){
	return jflow.pause( this,
		function( flow ){
			flow.wait();
				//  asynchronous call
			setTimeout(function(){
				
				//  continue event
				flow.continue();
			}, 200);
		}, 
		function( flow ) {
			return true;
		}
	);
}
//  create a flow-enabled function
function iAmData(){
	return jflow.pause( this,
		//  function-segment
		function( flow ){
			flow.wait();
			//  asynchronous call
			setTimeout(function(){
				
				//  continue event
				flow.continue();
			}, 200);
		}, 
		//  function-segment
		function( flow ) {
			return [
				"i","am","a record of an object"
			];
		}
	);
}
//  create a flow-enabled function
function iAmObject(){
	return jflow.pause( this,
		function( flow ){
			flow.wait();
			//  asynchronous call
			setTimeout(function(){
				
				//  continue event
				flow.continue();
			}, 200);
		}, 
		function( flow ) {
			return {
				i:"am a",
				normal:"Object"
			};
		}
	);
}
//  start a pause event
var returnValue, returnData, returnObject;
jflow.pause( this,
	//  the first function-segment
	function( flow ){
		
		returnValue = iCanFlow();
		returnData = iAmData(); 
		returnObject = iAmObject();
	},
	//  the third function-segment	
	function( flow ) {
		console.log("finally, ");  
		console.log(" returnValue = ", returnValue);
		console.log(" returnData = ", returnData);
		console.log(" returnObject = ", returnObject);
		
	}
);		
</code></pre>	

<h3 >
flow.ignore()
</h3>


Lets move on to some non-linear flow controls.  

`flow.ignore()` - Causes any calling event to "ignore" it's scope of flow. It will become "unlinked".. 
The `flow` object will only effect the current pause event and will singal to the calling event to continue.

Secondly, function-segments containing a return value other than `undefined` will stop execution of all further
function-segments and cause the calling pause event to account for the called pause event.

In the following code note:

* In `iCanFlow` an ignore event is called.  So the calling pause event will "ignore" this pause event's wait and continue events. 

* In `iCanFlow`,  the last function-segment will not run, due to the prior function-segment returning `true`.

* `iCanFlow` still executes its own function-segments in order as the flow events dictate;

* returnValue is an empty Object.

<pre><code>
//  create a flow-enabled function
function iCanFlow(){
	return jflow.pause( this,
		function( flow ){
			flow.ignore();
			flow.wait(2);
			//  asynchronous call
			setTimeout(function(){
				console.log("I'm fourth");
				//  continue event, accounts for one wait event
				flow.continue();
			}, 800);
			//  asynchronous call
			setTimeout(function(){
				console.log("I'm third");
				//  continue event, accounts for one wait event
				flow.continue();
			}, 500);
		},
		//  prior function-segment 
		function( flow ) {
			
			return true;
		},
		//  last function-segment
		function( flow ) {
			console.log("I'm last, but you will never see me :(");
			
		}
	);
}
//  start a pause event
var returnValue;
jflow.pause( this,
	
	function( flow ){
		
		console.log("I'm first");		
		//  call to flow-enabled function
		returnValue = iCanFlow();
		
	}, 
	function( flow ) {
		 
		console.log("I'm second, returnValue = ", returnValue);
	}
);	
</code></pre>


<h3 >
flow.next()
</h3>

`flow.next()` - Causes all wait events in the current function-segment to be accounted for and procedes to the next function-segment.
				
In the following code:

1. The wait event is `wait(7)`, requiring seven continue events

2. Accounting for the seven wait events is not done with seven continue events ( or `flow.continue(7)` ), 
but a call to `flow.next()`;  making all current wait events accounted for.


<pre><code>	
//  start a pause event
var returnValue;
jflow.pause( this,
	//  the first function-segment
	function( flow ){
		flow.wait(7);
		console.log("I'm first");		
		
		//  asynchronous call
		setTimeout(function(){
			console.log("I'm second");
			//  continue event, accounts for one wait event
			flow.next();
		}, 100);
		
	},
	//  the second function-segment 
	function( flow ) {
		 
		console.log("I'm third");
	}
);	
</code></pre>


<h3 >
flow.value()
</h3>
 


Lastly, 
`flow.value()` - sets the returning value, having the same effect as returning a value in a function-segment except the function-segment will continue to execute.
		
	//  create a flow-enabled function
	function iCanFlow(){
		return jflow.pause( this,
			function( flow ){
				flow.value([
					"i","am","a record of an object"
				]);
				flow.ignore();
				
				flow.wait(2);
				//  asynchronous call
				setTimeout(function(){
					console.log("I'm fifth");
					//  continue event, accounts for one wait event
					flow.continue();
				}, 800);
				//  asynchronous call
				setTimeout(function(){
					console.log("I'm fourth");
					//  continue event
					flow.continue();
				}, 500);
			} 
			
			
		);
	}
	//  start a pause event
	var returnValue;
	jflow.pause( this,
		//  the first function-segment
		function( flow ){
			flow.wait(7);
			console.log("I'm first");		
			//  the wait event is passed a 2, meaining the continue event must be called twice
			
			returnValue = iCanFlow();
			//  asynchronous call
			setTimeout(function(){
				console.log("I'm second");
				//  continue event, accounts for one wait event
				flow.next();
			}, 100);
			
		
		},
		//  the second function-segment 
		function( flow ) {
			 
			console.log("I'm third, returnValue = ");
			console.log(returnValue);
		}
	);	

<h3 >
Callback free
</h3>

Lets apply this knowledge to go callback free!
In node.js try the following:
	
	require("jflow-framework");
	var fs = require("fs");
		

	//  create a flow-enabled function
	function readFileFlow( st_location, options, fn_callback )  {
		//  declare values	
		var returnValue;
		//  return pause event
		return jflow.pause( this, function( flow ){
			//  call wait event
			flow.wait();
			//  asynchronous call to file 
			fs.readFile( st_location, options || "utf8", function( err, data ){
				if (typeof fn_callback === "function"){
					fn_callback.apply( fs, arguments );
				}
				//  error handling
				if( err ){
					
					returnValue = {
						ERROR: err
					};
					
				}
				else{
					returnValue = data;
				}
				//  account for wait event
				flow.continue();
				
			});
		
					
		}, function( flow ) {

			return returnValue;
		}
		);
		

		
	};//  readFileFlow
	
	//  run this when jFlow framework is ready
	jflow.ready( function( jflow ){
		//  start a pause event
		var returnValue;
		jflow.pause( this,
			//  function-segment
			function( flow ){
				//  *change "path-to-file" to actual file path*
				returnValue = readFileFlow("path-to-file");
			
			},
			//  function-segment 
			function( flow ) {
				//  handle error 
				if( returnValue.ERROR ){
	
					throw returnValue.ERROR;
				}
				else{
					//  print file
					console.log( returnValue.result );
				
				}
			}
			
		);
	});	



That's it! No more callback terrors!


<h2 >
Components
</h2>
jFlow components are object instances with a common, extendable and resuable structure. This includes features provided 
in a traditional Object Oriented Proramming language such as static, public and private members. Each component instance returns 
a unique object, i.e there is no need to use the "new" keyword.

Also, It may be helpful to briefly examine the <a href="http://www.infinitycbs.com/jflow/doc/jFlow.html#addComponent">addComponent definition</a>. 

<br />

<h3 >
Define a component
</h3>


The simplest jFlow component looks like:
<pre><code>	
//  define a component
var Foo = function(jflow) {
    //  component definition
    return {
		//  component method
        do : function() {
            console.log("i do this");
        }
    };
};
</code></pre>

<h3 >
Adding a component
</h3>

To add a component:
<pre><code>
//  add the component from above example
jflow.addComponent("Foo", Foo);
</code></pre>


<h3 >
Component Instance
</h3>
	
<pre><code>	
//  writes "i am initalized! My name is bob" from the above example
var foo = jflow.Foo( "bob" );
</code></pre>

<h3 >
Accessing instance properties:
</h3>
<pre><code>	
//  writes "bob does this" from the above example
foo.do();
</code></pre>

<h3 >
Add / define / create component
</h3>
Putting it together:
	
<pre><code>
//  define a component
var Foo = function(jflow) {
    //  component definition
    return {
		//  component intialization
		init: function( st_name ){
        	 //  do some initialization tasks
        	 this.st_name = st_name;
        	 console.log("i am initalized! My name is "+st_name);
        },
        //  component method
        do : function() {
            console.log( this.st_name+" does this");
        }
    };
};


//  add the component from above example
jflow.addComponent("Foo", Foo);

// when framework is ready
jflow.ready(function( jflow ){
	//  writes "i am initalized! My name is bob" from the above example
	var foo = jflow.Foo( "bob" );
)



</code></pre>	


To create an instance of the component:
<pre><code>
var foo = jflow.Foo();
</code></pre>

To access the `do` property:

<pre><code>
foo.do();
</code></pre>
	
Will display `i do this` in the console view

<h3 id = "Extending" >
Extending components
</h3>

You can extend a component two ways:

1.	As a component definition that will later specifiy what to extend . Observe how the `More` component is added on line 37.
2.	As a property of another component definition.

<pre><code>	
//  define a component
var Foo = function(jflow) {
    //  component definition
    return {
		//  component method
        do : function() {
            console.log("i do this");
        }
    };
};
//  component definition that will be specified what to extend later
var More = function(jflow) {

    return {

        doMore : function() {
            console.log("i do more");
        }
    };
};
//  a property of another component definition
More.MuchMore = function(jflow) {

    return {

        doMuchMore : function() {
            console.log("i do MuchMore");
        }
    };
}

jflow.addComponent("Foo", Foo);
//  Extend Foo Component with More.
//  You can extend a pre-existing component by 
//  simply referring to the component separated by a "."
jflow.addComponent("Foo.More", More);
//  run this when jFlow framework is ready
jflow.ready( function( jflow ){
	//  create instance
	var foo = jflow.Foo.More.MuchMore();
	foo.do();//		i do this
	foo.doMore();//		i do more
	foo.doMuchMore();//		i do MuchMore
});
</code></pre>

<h3 id = "Initialization" >
Initialization
</h3>

By default, the jFlow instance is global. However, the framework
does not assume you will use the global instance and in all of its component initialization features, 
will allow a closer refrence in the javaScript scope chain.
	
In the component definition, you can optionally define 4 special members; `init`, `initBefore`, `initAfter`, and `subvert`.

<h4 id = "init" >init</h4>


`init` will run when an instance of the component is created:

<pre><code>		
//  define a component
var Foo = function(jflow) {
    //  component definition
    return {
		init: function(){
			console.log("i ran when initalized");
		},
		//  component method
        do : function() {
            console.log("i do this");
        }
    };
}

jflow.addComponent("Foo", Foo);
//  run this when jFlow framework is ready
jflow.ready( function( jflow ){
	//  create instance
	var foo = jflow.Foo();
});
</code></pre>

You will see in the console view `i ran when initalized`


	
	
Any inherited extenion will NOT inherit its parent component's `init` member:

<pre><code>	
//  define Foo component
var Foo = function(jflow) {
    //  component definition
    return {
		init: function(){
			console.log("i ran when initalized");
		},
		//  component method
        do : function() {
            console.log("i do this");
        }
    };
}
//  an extention of Foo
Foo.More = function(jflow) {

    return {

        doMore : function() {
            console.log("i do more");
        }
    };
}

jflow.addComponent("Foo", Foo);
//  run this when jFlow framework is ready
jflow.ready( function( jflow ){
	//  create instance
	var foo = jflow.Foo();	
});
</code></pre>


The console will display nothing.

<h4 id = "initBefore" >
initBefore
</h4>	
	
When the `initBefore` method is defined, it will run when an instance of the component is created just like `init` except:
*	It runs "before" `init`.
*	It WILL inherit or override parent member.
	
<h4 id = "initAfter" >
initAfter
</h4>	
	
When the `initAfter` method is defined, it will run when an instance of the component is created just like `init` except:
*	It runs "after" `init`.
*	It WILL inherit or override a parent member.

Consider the following:

<pre><code>	
//  define Foo component
var Foo = function(jflow) {
    //  component definition
    return {
		initBefore: function(){
			console.log("i ran Foo before init when initalized");
		},
		init: function(){
			console.log("i ran Foo when initalized");
		},
		//  component method
        do : function() {
            console.log("i do this");
        }
    };
};
//  an extention of Foo
Foo.More = function(jflow) {

    return {
		//  override a parent component property.
		initBefore: function(){
			console.log("i ran Foo.More before init when initalized");
		},
		init: function(){
			console.log("i ran Foo.More when initalized");
		},
        doMore : function() {
            console.log("i do more");
        },
        initAfter: function(){
			console.log("i ran Foo.More after init when initalized");
		},
    };
};
//  an extention of Foo.More
Foo.More.MuchMore = function(jflow) {

    return {
		init: function(){
			console.log("i ran Foo.More.MuchMore when initalized");
		},
        doMore : function() {
            console.log("i do much more");
        }
        //  inherit initBefore and initAfter component property.
    };
};

jflow.addComponent("Foo", Foo);
jflow.ready( function( jflow ){
	//  create instance
	var foo = jflow.Foo.More.MuchMore();	
});
</code></pre>	
	
Console will read:

`i ran Foo.More before init when initalized`

`i ran Foo.More.MuchMore when initalized`

`i ran Foo.More after init when initalized`	

<h4 id = "subvert" >
subvert
</h4>

When this member is present, it is examined before `init`, `initBefore` and `initAfter`. 
This method's returning value will become the intialized value if it returns truthy.

<pre><code>
//  define Foo component
var Foo = function(jflow) {
    //  component definition
    return {
		//  This method's returning value will become the intialized value if it returns truthy
        subvert: function(){
            
            //return false;//  <- uncomment this and see what happens
            //  returning value will become the intialized value if it returns truthy, and it does
            return {
                do:function(){
                    console.log("i'm subverted! I do this now");
                }
            }
        },
        initBefore: function(){
            console.log("i ran Foo before init when initalized");
        },
        init: function(){
            console.log("i ran Foo when initalized");
        },
        //  component method
        do : function() {
            console.log("i do this");
        }
    };
};

jflow.addComponent("Foo", Foo);

jflow.ready( function( jflow ){
	//  create instance
	var foo = jflow.Foo();    
	foo.do();
});

</code></pre>

<h4 id = "Arguments" >
Arguments
</h4>

In all initalization members, (`init`, `initBefore`, `initAfter`, and `subvert`), you may pass in any argument upon
creating an instance of a given component.  It will transpose through all 4 initalization members:
	
<pre><code>	
//  jflow passed in
var Foo = function( jflow ) {
    
    return {

        subvert: function( st_value ){
            console.log( "do you really want me to subvert with a value like ["+st_value+"] ?");
            return false;
            
        },
        initBefore: function( st_value ){
            console.log( "initBefore sees ["+st_value+"]");
        },
        init: function( st_value ){
            console.log( "init sees ["+st_value+"]");
        },
        initAfter: function( st_value ){
            console.log( "initAfter sees ["+st_value+"]");
        },
        do : function() {
            console.log("i do this");
        }
    };
};

jflow.addComponent("Foo", Foo);
jflow.ready( function( jflow ){
	var foo = jflow.Foo( "bar" );    
	foo.do();
});
</code></pre>
	
Console writes

`do you really want me to subvert with a value like [bar] ?`

`initBefore sees [bar]`

`init sees [bar]`

`initAfter sees [bar]`

<h3 id="PrivateMembers">
Private members
</h3>	

Private members are a matter of declaring a value outside the component's returning object.
<pre><code>
		
var Foo = function(jflow) {
   //  define private variable
   var cantTouchThis = true;
   return {
		
        init: function( st_name ){
        	 //  do some initialization tasks
        	 this.st_name = st_name;
        	 console.log("i am initalized! My name is "+st_name);
        },
        do : function() {
            console.log( "cantTouchThis = "+cantTouchThis);
        }
    };
};
jflow.addComponent("Foo", Foo);

var foo = jflow.Foo();
//  writes undefined
console.log(foo.cantTouchThis);
//  writes "cantTouchThis = true"
foo.do();
		
</code></pre>

<h3 id = "Static" >
Static members
</h3>

Static members are properties you do not need to create a component instance to access.
Static members are assigned to the component definition using the property of `Static`. The
Static definition contains an object containing the properties you want to assign as static.

<pre><code>	
var Foo = function(jflow) {
    
    return {
		init: function( st_name ){
        	 this.st_name = st_name;
        	 console.log("i am initalized! My name is "+st_name);
        },
        do : function() {
            console.log( this.st_name+" does this");
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
			console.log("no instance, just me");
		}
	};
}

jflow.addComponent("Foo", Foo);
//  call static method
//  no need to create a component instance
jflow.ready( function( jflow ){
	jflow.Foo.iamStatic();
});
</code></pre>

<h3 id = "onInstall" >
onInstall
</h3>

The `onInstall` value is a function containing tasks you wish to execute when a component is installed onto
the jFlow framework. onInstall is flow-enabled, the framework will not be considered "ready" until 
all flow events occuring in the function have completed.
`onInstall` property can be assigned to a component definition using the property of `onInstall`. 
	
<pre><code>	
var Foo = function(jflow) {
    
    return {
		init: function( st_name ){
        	 this.st_name = st_name;
        	 console.log("i am initalized! My name is "+st_name);
        },
        do : function() {
            console.log( this.st_name+" does this");
        }
    };
};
//  assign onInstall property to the component definition
Foo.onInstall = function( jflow ){
	
	return jflow.pause( this,
		function( flow ){ //flow.ignore();
			//... asynchronous activity
		}, function( flow ) {
			return;
		}
	);
};
</code></pre>

<h3 id = "files" >
Component Files
</h3>

To create a component in a separate file, simply add the following 
at the end of your component definition (replace "Foo" with your component name and definition accordingly):
<pre><code>
jflow.addComponent("Foo", Foo);
</code></pre>
To limit whether or not a component can be called from the front-end or back-end, use one of the following as a template:
<br/><br/>	
Back End:

<pre><code>
if (typeof exports === 'object' && module.exports ){

	jflow.addComponent( "Foo", Foo );
}
else{
	throw new Error( "Foo is a server-side only script for the jFlow Framework");
}
</code></pre>	

Front End:

<pre><code>
if (typeof exports === 'object' && module.exports ){

	throw new Error( "Foo is a server-side only script for the jFlow Framework");
}
else{

	jflow.addComponent( "Foo", Foo );
}	
</code></pre>
	
