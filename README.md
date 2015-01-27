
jFlow Framework, is a model framework for node.js and in the browser. It provides a common component structure for 
maintainable and reusable code with asynchronous flow control.Some key fetures include:

*	Any number of asynchronous functions can be grouped / organised without the need for callbacks.
*	Components contain a reusable structure provided in traditional object oriented programming such as static, public and private members.
*	Extendable component structures (inheritance).
* 	Each component instance returns a unique object, i.e there is no need to use the "new" keyword.

<h1 >
Documentation
</h1>

<a href="http://www.infinitycbs.com/jflow/doc" >Complete and comprehisive documentation can be found here</a>

<h1 id="Installation">
Installation
</h1 >

For node.js
<pre><code>
npm install jflow-framework
</code></pre>

For Browser, download <a href = "https://github.com/Infinitycbs/jflow/archive/master.zip">here</a> and copy `jflow-framework.js` to 
your server's desired path
<h1 >
Usage
</h1>


For node.js
<pre><code>
require("jflow-framework");
</code></pre>

For the browser, in the HTML header or body footer:
<pre><code>
<script src="..pathto/jflow-framework.js"></script>	
</code></pre>


By default, the jFlow instance is global

