/**
 About jFlow Framework: http://www.infinitycbs.com/jflow
 
 ====================================================================
 Licence MIT
 ====================================================================
 
 @author: Shawn Dotey, mailto: shawn@infinitycbs.com

 Copyright 2014 Shawn Dotey

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


"use strict";


/** Core framework
 * <h1 >
Usage
</h1>


For node.js

	require("jflow-framework");




For the browser, in the HTML header or body footer:

	<script src="..pathto/jflow-framework.js"></script>

 * @class
 * @name jFlow
 * 
 *  */
var jFlowFramework = function ( ob_option ) {
	

/** 
The return value will always be an Object.  If the returned value in a function-segment is not an Object or Array, 
it will be converted into an Object { result: value };	
	
@callback flowResult
@returns {Object|Array} properly formatted result
@example

////		define a pause-enabled function that will convert result to an object
function fooPause {
			
	return jflow.pause( this,
			
		function( flow ){
			return 7;
		}
	});
}
////		define a pause-enabled function that will simply return an object
function fooData {
			
	return jflow.pause( this,
			
		function( flow ){
			return { i:"am", a:"object" };
		}
	});
}


var returnValue, ob_data;
jflow.pause( this,
		
	function( flow ){
		returnValue = fooPause();
		ob_data = fooData();
	}, function( flow ) {
		////		returnValue will = {result:5}
		console.log(returnValue)
		////		ob_data will = { i:"am", a:"object" }
		console.log(ob_data)
});


 
*/


	
	////		////		private varables		////		////		
	
	////		 unique id for various purposes
	var		sys_unique_ID 	= 	1;
	////		deubgging problems with console.log outputs
	var 	is_debug 		= 	false;
	////		track functions called with ready();
	var 	ar_onReady 		= 	[];
	////		////		private functions		////		////
	var say;
	var in_ready = 0;
	var thatJflow;
	var goReady =  function(){
		
		in_ready--;
		if(in_ready < 1){
			thatJflow.ready();
		}
		
	};
	var stopReady = function(){
		in_ready++;
	};
	var st_version = "1.0";
	
	var checkPause = function( flow ){
		////		 that.fn_run
		var  Calling_ob_localScope = flow.Calling_ob_localScope, fn_afterDone = flow.fn_run , ar_paramter = flow._AG;

		if( is_debug ) say("tick");	
		if ( ( flow._CountActive < 1) || ( flow._Is_returned ) ) {

				
				////		set starting count to one
				flow._C=1;
				
				////		increment current count
				flow._c+=1;
				
				var fn_runNow =  flow._AG[(flow._c)];
				
				if( typeof fn_runNow !== 'function' ){
						////		end of line
						flow.Calling_ob_localScope._CountActive -= 1;
						checkPause( flow.Calling_ob_localScope );
						return flow._Ob_Return;
						
						// flow.return( undefined );
					  
				}else {
					////		assign global calling scope to this scope
					jflow.Calling_ob_localScope = flow;
					////		make sure current function-segment completes
					flow._CountActive += 1000;
					////		call current function-segment
					var value = fn_runNow.call( flow.scope, flow );
					flow._CountActive -= 1000;
					////		assign global calling scope back to whatever it was before being assigned this scope
					jflow.Calling_ob_localScope = flow.Calling_ob_localScope;			
					
					////		is function returned with a value?
					if ( value !== undefined ) {
						////		update return value;
						flow.value( value );
						////		increment calling scope active
						flow.Calling_ob_localScope._CountActive -= 1;
						checkPause( flow.Calling_ob_localScope );
						return flow._Ob_Return;
					}
					
					////		end of function
					checkPause( flow.Calling_ob_localScope );
					return checkPause( flow );
					
				}
				
				return flow._Ob_Return;
		}
		return flow._Ob_Return;
	};
	
	////		basic clone method
	var clone = function(obj) {
	    ////		http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
	    if(obj == null || typeof( obj ) != 'object'){ return obj; }
	      
	
	    var temp = obj.constructor(); // changed
	
	    for(var key in obj) {
	        if( obj.hasOwnProperty( key ) ) {
	            temp[ key ] = clone( obj[ key ] );
	        }
	    }
	    return temp;
	};
	////		basic merge method
	var merge = function( ob_1, ob_2 ){
		
	    for ( var st_index in ob_2 ) { ob_1[ st_index ] = ob_2[ st_index ]; }
	    
	    return ob_1;
	    
	};////		merge
	
	
	////		////		construct framework		////		////		
	/** @lends jFlow */	
	var jflow = {
		
		/**Enables debug information to display in console...
		 
		 
		 @memberOf jFlow#	
		 @type Boolean
		 @default "false"
		 */
		is_debug: is_debug,
		
		init: function( ob_option ){
			thatJflow = this;
			ob_option = ob_option || {};
			this.ob_option = ob_option;
			////		increase say scope
			say = this.say;
			////		use for console log events;
			this.ar_log = [];
			////		used to store all Component's .onAfterReady and execute at the approprate time
			
			this.ar_fn_afterReady = [];
			this.is_jFlowFramework = true;
			
			
			
			stopReady();
			jflow.pause( this,
				function( flow ){ 
					
					
					}, function( flow ) {
			
					if( typeof window !== "undefined" && document.readyState == "loading" ){
						flow.wait();
						
						window.addEventListener( 'load', function() { 	
							
							flow.continue();
						
						}, false);
						
					}
					
					}, function( flow ) {

					////		attach components of framework
					var addComponent = jFlowFramework._addComponent;

					for( var st_componentName in addComponent ){
										
						jflow.installComponent( st_componentName, addComponent[ st_componentName ] );
						
					}
				}, function( flow ) {
					
					if( typeof ob_option.fn_onInstall === "function" ){
					
						jflow.onInstall = ob_option.fn_onInstall;
						
					}
					if( typeof jflow.onInstall === "function" ){
						
						jflow.onInstall( jflow );
						
					}
					
				}, function( flow ) {
					
					////		delete component que
					delete jFlowFramework._addComponent;	
						
					////		is this ran in a browser?
					if (typeof exports !== 'object' ){////		is this ran in a browser? = yes
	
//jflow.merge( jflow.BrowserCore(ob_option) );
						
					} else {////		is this ran in a browser? = no
						
//jflow.merge( jflow.ServerCore(ob_option) );
						
					}
				
					jflow.in_lastUpdate = new Date().getTime();
					
				}, function( flow ) {
					
					goReady();
				
				}, function( flow ) {
					var ar_fn_afterReady = jflow.ar_fn_afterReady;
					var in_length = ar_fn_afterReady.length;
					while(in_length--){
						
						var fn_afterReady = ar_fn_afterReady[ in_length ];
						
						if( typeof fn_afterReady === "function" ){
							
							fn_afterReady( jflow );
							
						}
						
					}
					
			
			});
			return this;
		},////		init
		version: function(){
			return st_version;
		},
		/**
		 Causes any function passed to jflow.ready() to wait until all flow-enabled events are complete
		*
		 @see jFlow#ready
		 @memberOf jFlow#
		 @return {chainable}
		 
		 @param {Function} fn_whenready - executes when jFlow framework is not busy
		 @param {Array} ar_arguments - list of arguments passed into fn_whenready
		 @param {Scope} scope - optionally, the scope for fn_whenready
		
		 
		 @example
	     jflow.notReadyUntil( function( st_toUse ){
	     	console.log("you said "+st_toUse);
	     	return jflow.pause( this,
				function( flow ){ //flow.ignore();
					//  ... some flow activity
				
					
				}
			);
	     	
	     }["some string"], jflow);
		*/
		
		
		notReadyUntil: function( fn_notReadyUntil, ar_arguments, scope ){
			stopReady();
			scope = scope || {};
			ar_arguments = ar_arguments || [];
			return jflow.pause( this,
				function( flow ){ //flow.ignore();
					fn_notReadyUntil.apply( scope, ar_arguments );
				}, function( flow ) {
					goReady();
				}
			);
		
			return this;
		},////		notReadyUntil
		/**
		 Function to execute when the framework is ready.  This works in conjunction with jflow.notReadyUntil() 
		*
		 @see jFlow#notReadyUntil
		 @memberOf jFlow#
		
		 @param {Function} fn_whenready - executes when the jFlow framework is not busy.
		 When executed, the current jFlow instance is passed into the first argument.
		
		 @return {chainable}
		
		 
		 @example
		     jflow.ready(function( jflow ){
		     	
		     	//do stuff now that jflow is ready
		     });
		*/
		readyFirst: function( fn_whenready ){
			
			if( typeof fn_whenready === "function"){
				ar_onReady.unshift(fn_whenready);
			}
			
			if( in_ready > 0 ){
				
				return this;
				
			}
			
			while(ar_onReady.length>0){
				var fn_ready = ar_onReady.shift();
				if(fn_ready){
					fn_ready( jflow );
				}
			};
			
			return this;
		},
		ready: function( fn_whenready ){
			
			if( typeof fn_whenready === "function"){
				ar_onReady.push(fn_whenready);
			}
			
			if( in_ready > 0 ){
				
				return this;
				
			}
			
			while(ar_onReady.length>0){
				var fn_ready = ar_onReady.shift();
				if(fn_ready){
					fn_ready( jflow );
				}
			};
			
			return this;
		},
		
		/**
		 Test if this script is ran on node.js
		*
		 @see jFlow#isBrowser
		 @memberOf jFlow#
		 @return {Boolean} Returns true if this is ran server-side
		 
		 @example
		     jflow.isNodejs();
		*/
		isNodejs: function(){
			if (typeof exports === 'object' ){
				return true;
			}
			
		},////		isNodeJs
		
		/**
		 Test if this script is ran in a browser
		
		 @see jFlow#isNodejs
		 @memberOf jFlow#
		 @return {Boolean} Returns true if this is ran client-side
		 
		 @example
		     jflow.isBrowser();
		*/
		isBrowser: function(){
			if (typeof exports !== 'object' ){
				return true;
			}
			
		},////		isBrowser
		/**
		 Used to Install a component and component extentions
		 @memberOf jFlow#     
		 @see jFlow#addComponent
		
		 @chainable
		
		 @param {String} st_componentName Name of component.  You can extend a pre-existing component by simply referring to the component 
		 in the string separated by a "."
		 @param {Function} fn_component a function returning an object.
		 Recursively, will search [fn_component] for attached extentions
		
		
		@example
		
	
		////		define a component
		var Something = function(jflow) {
			return {
		
				do : function() {
					alert("i do this")
				}
			};
		}
		////		define a extention for "Something"
		var More = function(jflow) {
		
			return {
		
				doMore : function() {
					alert("i do more")
				}
			};
		}
		////		define a extention that will recursively, search [fn_component] for extentions
		More.TooMuch = function(jflow) {
		
			return {
		
				doOverload : function() {
					alert("i do tooMuch")
				}
			};
		}
		jflow.installComponent("Something", Something);
		////		You can extend a pre-existing component by 
		////		simply referring to the component in the string, separated by a "."
		jflow.installComponent("Something.More", More);
		var foo = jflow.Something.More.TooMuch();
		foo.do();
		foo.doMore();
		foo.doOverload();
	
		*/
		installComponent : function( st_componentName, fn_component ) {		
			
			////		private argument used recursively
			var fn_atComponent = arguments[2];
			if (!fn_atComponent) {
				var ob_place = this;
			} else {
				var ob_place = fn_atComponent;
			}
			////		these properties are reserved
			var ob_reservedNames = {
				Static: true,
				onInstall: true
			};
			////		validate
			if ( typeof st_componentName !== "string" ){ throw new Error("installComponent: argument [st_componentName] must be a string"); }
			
			////		get the right component to extend
			var ar_componentName = st_componentName.split( "." );
			var in_length = ar_componentName.length;
			if( in_length > 1){
				
				for(var i=0; i<in_length-1; i++){
					var st_currentComponent = ar_componentName[i];
					ob_place = ob_place[st_currentComponent];
					if( !ob_place ){
						throw new Error("addComponent: ["+st_currentComponent+"] doesn't exist yet, add component ["+st_currentComponent+"] before adding ["+st_componentName+"]");
					}
					////		
					fn_atComponent = ob_place;
				
				  
				};
				st_componentName = ar_componentName[ in_length-1 ];
			}
			
 
			////		create initialization method
			ob_place[ st_componentName ] = function( skipInitTest ){
				
				////		actual call to construct
				var ob_constructed = fn_component( jflow );


				if( typeof ob_constructed !== "object"){
					throw new Error(" component ["+st_componentName+"] must return an object of values");
				}
				////		is this an extention of another component?
				if ( fn_atComponent ) {
					////		is this an extention of another component? = yes
					////		get constructed parent component, do not run init procedure
					////		this creates a recursive cycle until jflow root component is found 
					var fn_atComponentConstructed = fn_atComponent( "~-is_skipInit" );
					////		each extended component needs to use its own init property
					delete fn_atComponentConstructed.init;
					////		merge parent component with new component
					ob_constructed = merge( fn_atComponentConstructed, clone( ob_constructed ) );
					
				}
				
				////		run init procedure?
				if( skipInitTest !== "~-is_skipInit" ){
					
					////		run init procedure? = yes
					var returnObject = ob_constructed, subverted;
					////		is subvert present
					if (ob_constructed.subvert) {
					
						subverted = ob_constructed.subvert.apply(ob_constructed, arguments);
						
					}
					
					if( subverted ){ 
						returnObject = subverted;
					}
					else{
						
						if (ob_constructed.initBefore) {
					
							ob_constructed.initBefore.apply(ob_constructed, arguments);
						}
						if (ob_constructed.init) {
							
							ob_constructed.init.apply(ob_constructed, arguments);
						}
						if (ob_constructed.initAfter) {
							
							ob_constructed.initAfter.apply(ob_constructed, arguments);
						}
						
						
					}
					
					
				}
				
				return returnObject || ob_constructed;
			};////		initialization method
			
			
					
			////		current location component is being installed	
			var ob_componentLocation = ob_place[ st_componentName ];	
					
			////		////		traverse new component properties and install accordingly			////		////		
			for( var st_subClassName in fn_component ) {
				
				var currentComponentValue = fn_component[ st_subClassName ];
					
				
				////		do this first so Static values are ready for oninstall and any sub-component
				////		is Static? 
				if( st_subClassName === "Static" ){
					////		build static methods
					var ob_static = currentComponentValue( jflow );
					for( var st_staticName in ob_static ){
	
						ob_componentLocation[st_staticName] = ob_static[st_staticName];

					}
				}
				////		 is st_subClassName a reserved name?
				else if( !ob_reservedNames[st_subClassName] ) {////		 is st_subClassName a reserved name? = NO
					
					////		this should only be a component extention, install accordingly
					if( typeof currentComponentValue !== "function"){
						throw new Error(" installComponent ["+st_subClassName+"] must be a function");
					}
					jflow.installComponent( st_subClassName, currentComponentValue , ob_componentLocation);
				}
				////		 is onInstall?
				else if( st_subClassName === "onInstall" ){
					////		do this now
					if( jflow.is_debug ) say(false, "installing "+st_componentName+"  ");						
					jflow.pause( this,
					function( flow ){
						if( jflow.is_debug ) say("installComponent: onInstall "+st_componentName+"");						
//flow.ob_store.is_ready = jflow.is_ready;
						jflow.notReadyUntil( currentComponentValue, [this] );
						if( jflow.is_debug ) say(false, "installComponent: onInstall ran "+st_componentName+"  ");									
					}, function( flow ) {
						
//jflow.is_ready = flow.ob_store.is_ready;

//if(jflow.is_ready) jflow.ready();

					});
				}
				
				
			}
				
			return this;
		},////		installComponent
		
		
		////		merge object to jflow base
		merge: function ( ob_2 ){
		   
		    merge( this, ob_2);
		    
		    return this;
		},

		/**
		Used to organize the order of asynchronous activity. 
		
See <a href="http://www.infinitycbs.com:5858/jflow/doc/#toc3" target="_blank" >Asynchronous Flow Control</a>  for more details and in depth examples.
		
		@param {Object} scope What the function-segments are applied to when called
		@param {...Function} function-segment Function to be called in order. separated by pause-enabled controls (flow)
		@param {Object} flow Controls the flow of function-segments.
		@param {flowWait} flow.wait() Event causes the next function-segment to "wait" until a continue event has been called to account for it( flow.wait() ) -or- a flow.next() has been called.
		
		@param {flowContinue} flow.continue() Event accounts for a wait event. Causes the next function-segment to execute if all wait events are accounted for.
		
		@param {flowNext} flow.next() Event causes all wait events in scope to be accounted for and procedes to the next function-segment.
		
		@param {flowIgnore} flow.ignore() Causes any calling function to "ignore" this scope of events. The flow object will only effect this scopes flow control.
		
		@param {flowValue} flow.value() sets the returning value. Same as returning a value in a function-segment except the function-segment will continue to execute.
		
				
		
		@return {flowResult}
		It is important to note that the return will always be an Object.  If the final result is not an Object, 
		it will be converted into { result: value }; See {@link flowResult pauseResult Definition} for more details.
		
		
		
		@memberOf jFlow#     
		
		@example
		
		////		start a pause event
		jflow.pause( this,
			////		the first function-segment
			function( flow ){
				
				console.log("I'm first");		
				////		wait event must be accounted for in order to go on to the next function-segement
				flow.wait();
				////		asynchronous call
				setTimeout(function(){
					console.log("I'm second");
					////		continue event, accounts for the wait event above
					flow.continue();
				}, 200);
			},
			////		the second function-segment	 
			function( flow ) {
				 
				console.log("I'm third");
			}
		);		


The console will write:
		
			I'm first
			I'm second
			I'm third		
		
		
		*/
		


		
		pause: function( scope ) {
			////		scope wraper
			
			////		define return object.
			var Return_Scope = {};
		
						
			////		init local flow properties, this is the [flow] argument in each function-segment
			var flow = {
 				////		arguments of pause event
 				_AG:Array.prototype.slice.call(arguments),
				////		arguments counter
				_c:0,
				////		calling scope
				Calling_ob_localScope: jflow.Calling_ob_localScope || {},
				////		increment of wait events
				_CountActive: 0,
				////		return object
				_Return_Scope: Return_Scope,
				////		boolean test for complete pause event
				_Is_returned: false,				
				
				////		////		These are for compatability with earlier versions		////		////		
				_Resume: function() {return flow.ignore();},_WaitDown: function() {return flow.continue();},_WaitUp: function() {return flow.wait();},_Return: function( value ) {flow.return( value );},_ReturnValue: function( value ) {return flow.value( value );},ob_store:{},
				////		////		Above are for compatability with earlier versions		////		////		
				////		store object
				store:{},
				/**
				flow.value() sets the returning value. Same as returning a value in a function-segment except the function-segment will continue to execute.
		
				@callback flowValue
				@param {Number} [value] Return value to set
				@returns {Object} (flow._Return_Scope) properly formatted result
				@see jFlow#pause
				*/
				
				value: function( value ) {
			
					var st_type = typeof value;
					if( ( st_type === 'object' ) || ( value instanceof Array )) {////		is return value an object? - yes
						////		traverse return object and assign ob_assignReturnValue the same index and value
						for ( var st_index in value ) {
							////	assign value	
							Return_Scope[ st_index ] = value[ st_index ];
							
						}
					}
					else {
						Return_Scope.result = value;
					}
					
					return Return_Scope;
				},
				
				
				
				/**
				flow.wait() Event causes the next function-segment to "wait" until a continue event has been called to account for it( flow.wait() ) -or- a flow.next() has been called.
				@callback flowWait
				@param {Number} [v] Manually set the addtional number of taks to complete
				@returns {Number} (flow._CountActive) Tasks currently active
				@see jFlow#pause
				*/
				
				wait: function( v ) {
		
					v = v || 1;
		
					flow._CountActive = flow._CountActive+v;
		
					return 	flow._CountActive;		
				},
				/**
				flow.continue() Event accounts for a wait event. Causes the next function-segment to execute if all wait events are accounted for.
				@callback flowContinue
				@param {Number} [v] Manually set the reduction of tasks that are complete
				@returns {Number} (flow._CountActive) Tasks currently active
				@see jFlow#pause
				*/
				continue: function( v ) {
					v = v || 1;
					
					flow._CountActive -= v;
					checkPause( flow );
					return flow._CountActive;
				},
				/**
				flow.ignore() - Causes any calling function to "ignore" it scope of flow controls. The flow object will only effect the current pause event.
				
				@callback flowIgnore
				
				@returns {Number} (flow._CountActive) Tasks currently active;
				@see jFlow#pause
				*/
				ignore: function() {

					if( flow._isIgnore ){
						throw new Error("jFlow.pause.ignore: can only call ignore once");
					}
					flow._isIgnore = true;
					flow.Calling_ob_localScope._CountActive -= 1;
					return flow._CountActive;
				},
				/**
				flow.next() - Causes all wait events in the current function-segment to be accounted for and procedes to the next function-segment.

				@callback flowNext
				@returns {Object} (flow._Return_Scope) properly formatted result
				@see jFlow#pause
				*/
				next: function() {
					
					 
					flow._CountActive = 0;
					checkPause( flow );
					return Return_Scope;
				},
				
				/**
				 	Returning result
				 	@property {Object} 
				 	
				*/
				
				_Ob_Return: Return_Scope
				
			};////		flow
			
			flow.Calling_ob_localScope._CountActive += 1;
			jflow.Calling_ob_localScope = flow;
			////		return local scope
			flow.scope = scope;
			return checkPause( flow );
			
//fn_run.apply( fn_run, arguments );
				
		},
		/**
			Generate and returns a unique id for various purposes;
			@return {Number} result
			@memberOf jFlow# 
		*/
		////		return and increment a unique id
		getUniqueId: function() {
			
			return sys_unique_ID++;
			
		},////		getUniqueId
		/**
		Prints and logs debug information as configured, all default to false:
<pre><code>
////		calls say() for pre-wrtten debug info for various routines
jflow.is_debug = true;
////		prints a console.trace() with each call
jflow.is_debugStacktrace = true;
////		sends a JSON object in a reoponse header( server side ) when included in a jflow.REQUEST.run() object SEE
jflow.is_sendLog = true;	
////		master switch, disables all responses to say()
jflow.is_sayOff = true;	
////		turns all console printsouts off. used when strictly using jflow.is_sendLog
jflow.is_sayReadoutOff = true;
</code></pre>

		
		@return {chainable}
		@memberOf jFlow#
		{chainable}
		
		*/	
		////		used for debugging, prints in console
		say: function()
		{
			
			if( jflow.is_sayOff ){
				return;
			}
			//  is this grouped
			var is_skim = arguments[0] === false ? true:false;
			var ob_skip = {};
			//  not grouped
			if (!is_skim) { console.log(""); }
			//  traverse arguments
			for ( var index in arguments )  {
				
				var sayVal = arguments[ index ];
				//  skip first arguement if false and there are other arguments
				if(sayVal === false && index == 0 ){ 
					ob_skip[ index ] = true;
					continue; 
					
				}
				
				if( (typeof sayVal) == "object" || typeof sayVal === 'array'){ 
						
					//  write out object if allowed
					if( !jflow.is_sayReadoutOff ){ console.dir(sayVal); }

				}	
				else {
					//  write out noon object if allowed
					if( !jflow.is_sayReadoutOff ){ console.log(""+">"+sayVal+"<"); }

				}
			}
			//  are we creating a log?
			if( jflow.is_sendLog ){
				for(var i=0,j=arguments.length; i<j; i++){
				  if(!arguments[i]) continue;
				  jflow.ar_log.push(arguments[i]);
				};
			}	
			//  do we show a stack trace?
			if( jflow.is_debugStacktrace ){
				if( !jflow.is_sayReadoutOff ){ console.trace(); }
			}	
				
			return this;
		},// say
		/**
			Same as {@link jFlow#installComponent installComponent}  except jFlow.addComponent can be called before the framework is initalized
			
			
		 @chainable
		
		 @param {String} st_componentName Name of component.  You can extend a pre-existing component by simply referring to the component 
		 in the string separated by a "."
		 @param {Function} fn_component a function returning an object.
		 Recursively, will search [fn_component] for attached extentions

See <a href="http://www.infinitycbs.com:5858/jflow/doc/#toc10" target="_blank" >Components</a> for more details and in depth examples.			
		
			
			@example
			
		
			////		define a component
			var Something = function(jflow) {
				return {
			
					do : function() {
						alert("i do this")
					}
				};
			}
			////		define a extention for "Something"
			var More = function(jflow) {
			
				return {
			
					doMore : function() {
						alert("i do more")
					}
				};
			}
			////		define a extention that will recursively, search [fn_component] for extentions
			More.TooMuch = function(jflow) {
			
				return {
			
					doOverload : function() {
						alert("i do tooMuch")
					}
				};
			}
			jflow.addComponent("Something", Something);
			////		You can extend a pre-existing component by 
			////		simply referring to the component in the string, separated by a "."
			jflow.addComponent("Something.More", More);
			var foo = jflow.Something.More.TooMuch();
			foo.do();
			foo.doMore();
			foo.doOverload();
		
		
			@see jFlow#installComponent
			@memberOf jFlow#
			
		*/
		addComponent: function( st_componentName, fn_component ){
			jFlowFramework.addComponent.apply( this, arguments);
		},
		is_jflow:"iamjflow"
		
			
			
	};////		_construct jFlowFramework
	
	jflow.init( ob_option );
	
	return jflow;
	
};////		end framework jFlowFramework

/**
			Same as {@jFlow#installComponent}  except jFlow.addComponent can be called before the framework is initalized

			See <a href="http://www.infinitycbs.com:5858/jflow/doc/#toc11" target="_blank" >Components<a/>  for more details and in depth examples.			
			@see jFlow#installComponent
			@memberOf jFlow#
			
		*/
jFlowFramework.addComponent = function(st_componentName, fn_component) {
	////		create addclass object que if nessesary
	if ( typeof st_componentName !== "string") {
		throw new Error("jFlowFramework.addComponent: argument [st_componentName] must be a string");
	}
	if ( typeof fn_component !== "function") {
		throw new Error("jFlowFramework.addComponent: argument [fn_component] must be a function returning and object");
	}
//console.log( "jFlowFramework.addComponent = "+st_componentName)
	////		is this an initalized framework?
	if( this.is_jFlowFramework ){
		
		this.installComponent( st_componentName, fn_component );
	}
	else{
		
		if ( typeof jFlowFramework._addComponent !== 'object') {
			jFlowFramework._addComponent = {};
		}
		////		add to framework components que
		jFlowFramework._addComponent[st_componentName] = fn_component;
	}
	
	
};


/**
Compare what version is newer between two strings
		
	
	@memberOf jFlow#
	@Returns {Number} 1 if a > b 
	@Returns {Number} -1 if a < b
	@Returns {Number} 0 if a == b
*/
jFlowFramework.versionCompare = function( a, b ){
	
	if (a === b) {
       return 0;
    }

    var a_components = a.split(".");
    var b_components = b.split(".");

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return 1;
        }

        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return -1;
        }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
        return 1;
    }

    if (a_components.length < b_components.length) {
        return -1;
    }

    // Otherwise they are the same.
    return 0;

	
};
jFlowFramework.checkIntegrity = function( currentJflow, otherJflow ){
	
	if( typeof currentJflow !== "object" ){
		return{
			result: false,
			code:"notreal",
			reason: "Current global Jflow property is not an Object"
		};
	};
	if ( currentJflow.is_jflow !== "iamjflow" ){
		return{
			result: false,
			code:"notreal",
			reason: "Current global Jflow property is not an authentic jFlow Framework"
		};
	};
	//  are we compareing to another version?
	if ( jFlowFramework.checkIntegrity( otherJflow ).result ){
		var in_new = currentJflow.version( currentJflow, otherJflow );
		if (in_new === 1){
			
			return{
				result: false,
				code:"old",
				reason: "Current framework is an older version"
			};
		}
		
	};
	return{
		
		result: true,
		
	};
};


//  initalize framework
var newjFlow = jFlowFramework();
if (typeof exports === 'object' ){
	
	
	console.log("\n\n");	
	console.log("jFlow Framework, version "+newjFlow.version()+"");	
	console.log(" infinitycbs.com/jflow\n\n");
	
	if(GLOBAL.jflow){
		var result = jFlowFramework.checkIntegrity( GLOBAL.jflow, newjFlow );
		
		if( !result.result ){
			console.log("jFlow WARNING: "+result.reason);
		}
		throw new Error("jFlow WARNING: jFlow Framework was attampting to initalize while a current version of jflow already exists");
		
	}
	else{
		GLOBAL.jflow = newjFlow;
		
	} 
	module.exports = newjFlow;
}
else{
	
	if(window.jflow){

		var result = jFlowFramework.checkIntegrity( window.jflow, newjFlow );
		
		if( !result.result ){
			console.log("jFlow WARNING: "+result.reason);
		}
		throw new Error("jFlow WARNING: jFlow Framework was attampting to initalize while a current version of jflow already exists");
		
	}
	else{
		window.jflow = newjFlow;
	}
	
}


