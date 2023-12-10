import { useRef, useState } from "react";
import { Button, ScrollView } from "react-native";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function TestView(params) {
	const webref=useRef(null);
	const [text,setText]=useState('');
	const [data,setData]=useState('');
	const [url,setUrl]=useState('http://aniwatch.to/watch/baki-2649?ep=28915');
	
	async function cat(tep) {
		try {
			// let d=await fetch(tep).then((res)=>res.text());
			// setData(d);
		} catch (e) {
			console.warn('poop head',e);
		}
	}
	const onMessage = event => {
		console.log(';');
    const data = event.nativeEvent.data;
    try {
      const requestData = JSON.parse(data);
			console.log(requestData);
			if(requestData.datao != null){
				setText(requestData.datao);
				setUrl(requestData.datao.substring(0,requestData.datao.indexOf('?')));
				cat(requestData.datao);
			}
    } catch (error) {
      console.error('Error parsing message data:', error);
    }
  };
	const onLoadProgress = ({ nativeEvent }) => {
    //console.log('Loading Progress:', nativeEvent);
    // You can add more details if needed
  };
	const vidcat=`
	(function() {
		setInterval(()=>{
			let message = {"datao":document.getElementById('iframe-embed').innerHTML};
			window.ReactNativeWebView.postMessage(JSON.stringify(message));
		},2000);
	})();
`;

	pienear=()=>{
		webref?.current.injectJavaScript(`
			window.ReactNativeWebView.postMessage(JSON.stringify({"datao":document.getElementById('iframe-embed').src}));
		`);
	};
	

  const injectJavaScript0 = `
    (function() {
      let open = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function() {
				let msg = { "list":document.querySelectorAll('iframe')};
				window.ReactNativeWebView.postMessage(JSON.stringify(msg));
				this.addEventListener("load", function() {
					let message = {"status" : this.status, "response" : this.response, "list":document.querySelectorAll('iframe')};
					window.ReactNativeWebView.postMessage(JSON.stringify(message));
				});
    open.apply(this, arguments);
}
    })();c
  `;
	const injectJavaScript = `
	(function() {
		let originalOpen = XMLHttpRequest.prototype.open;

		window.ReactNativeWebView.postMessage('got in');
		XMLHttpRequest.prototype.open = function(method, url) {
			this._method = method;
			this._url = url;

			
			// Save a reference to 'this' to access it inside the event listener
			let xhrInstance = this;
	
			// Add an event listener for the load event
			setTimeout(() => {
				let requestData = {
					method: xhrInstance._method,
					url: xhrInstance._url,
					headers: parseHeaders(xhrInstance.getAllResponseHeaders())
				};
	
				// Send the details to the React Native side
				window.ReactNativeWebView.postMessage(JSON.stringify(requestData));
				originalOpen.apply(this, arguments);
			}, 5000);

			
		};
	
		// Function to parse headers into an object
		function parseHeaders(headersString) {
			let headers = {};
			let headerArray = headersString.trim().split('\n');
	
			for (let i = 0; i < headerArray.length; i++) {
				let parts = headerArray[i].split(': ');
				let headerName = parts.shift();
				let headerValue = parts.join(': ');
				headers[headerName] = headerValue;
			}
	
			return headers;
		}
	})();	
  `
  return (
    <ScrollView style={styles.container}>
			
      <View style={{ flex: 1 }}>
        <WebView
					ref={webref}
          style={{ width: '100%',height:300 }}
          source={{ uri: 'http://aniwatch.to/watch/baki-2649?ep=28915' }}
          injectedJavaScript={injectJavaScript}
          onMessage={onMessage}
					//injectJavaScript={vidcat}
					//onLoadProgress={onLoadProgress}
					//onLoadEnd={pienear}
        />
      </View>
			<WebView
          style={{ width:'100%',height:300 }}
          source={{ uri: url }}
          //injectedJavaScript={vidcat}
          //onMessage={onMessage}
					//injectJavaScript={vidcat}
					//onLoadProgress={onLoadProgress}
					//onLoadEnd={pienear}
        />
      <View style={{ flex: 0.7}} contentContainerStyle={{justifyContent:'center'}}>
        <Button title="push" onPress={pienear}/>
				<Text>{text}</Text>
				<Text>{data}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#888",
  },
});
