var injected = function() {
  "use strict";
  function defineUnlistedScript(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  const definition = defineUnlistedScript(() => {
    console.log("MetaMask Extension: Injected script loaded");
    window.addEventListener("message", async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === "CONNECT_WALLET_REQUEST" && event.data.source === "metamask-extension-content") {
        try {
          await connectToMetaMask();
        } catch (error) {
          sendConnectionResult({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          });
        }
      }
    });
    async function connectToMetaMask() {
      if (typeof window.ethereum === "undefined") {
        sendConnectionResult({
          success: false,
          error: "MetaMask is not installed. Please install MetaMask extension."
        });
        return;
      }
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        if (accounts.length === 0) {
          sendConnectionResult({
            success: false,
            error: "No accounts found. Please unlock MetaMask."
          });
          return;
        }
        const account = accounts[0];
        sendConnectionResult({
          success: true,
          account,
          chainId: await window.ethereum.request({ method: "eth_chainId" })
        });
      } catch (error) {
        let errorMessage = "Failed to connect to MetaMask";
        if (error.code === 4001) {
          errorMessage = "User rejected the connection request";
        } else if (error.code === -32002) {
          errorMessage = "Please check MetaMask - connection request pending";
        } else if (error.message) {
          errorMessage = error.message;
        }
        sendConnectionResult({
          success: false,
          error: errorMessage
        });
      }
    }
    function sendConnectionResult(result2) {
      window.postMessage({
        type: "WALLET_CONNECTION_RESULT",
        payload: result2
      }, "*");
    }
  });
  injected;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      return await definition.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"injected"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
injected;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0ZWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9kZWZpbmUtdW5saXN0ZWQtc2NyaXB0Lm1qcyIsIi4uLy4uL2VudHJ5cG9pbnRzL2luamVjdGVkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkZWZpbmVVbmxpc3RlZFNjcmlwdChhcmcpIHtcbiAgaWYgKGFyZyA9PSBudWxsIHx8IHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBkZWZpbmVVbmxpc3RlZFNjcmlwdCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdNZXRhTWFzayBFeHRlbnNpb246IEluamVjdGVkIHNjcmlwdCBsb2FkZWQnKTtcblxuICAvLyBMaXN0ZW4gZm9yIGNvbm5lY3Rpb24gcmVxdWVzdHMgZnJvbSBjb250ZW50IHNjcmlwdFxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIChldmVudCkgPT4ge1xuICAgIC8vIE9ubHkgYWNjZXB0IG1lc3NhZ2VzIGZyb20gc2FtZSBvcmlnaW5cbiAgICBpZiAoZXZlbnQub3JpZ2luICE9PSB3aW5kb3cubG9jYXRpb24ub3JpZ2luKSByZXR1cm47XG4gICAgXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ0NPTk5FQ1RfV0FMTEVUX1JFUVVFU1QnICYmIFxuICAgICAgICBldmVudC5kYXRhLnNvdXJjZSA9PT0gJ21ldGFtYXNrLWV4dGVuc2lvbi1jb250ZW50Jykge1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb25uZWN0VG9NZXRhTWFzaygpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VuZENvbm5lY3Rpb25SZXN1bHQoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yIG9jY3VycmVkJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGNvbm5lY3RUb01ldGFNYXNrKCkge1xuICAgIC8vIENoZWNrIGlmIE1ldGFNYXNrIGlzIGluc3RhbGxlZFxuICAgIGlmICh0eXBlb2YgKHdpbmRvdyBhcyBhbnkpLmV0aGVyZXVtID09PSAndW5kZWZpbmVkJykge1xuICAgICAgc2VuZENvbm5lY3Rpb25SZXN1bHQoe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6ICdNZXRhTWFzayBpcyBub3QgaW5zdGFsbGVkLiBQbGVhc2UgaW5zdGFsbCBNZXRhTWFzayBleHRlbnNpb24uJ1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFJlcXVlc3QgYWNjb3VudCBhY2Nlc3NcbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgKHdpbmRvdyBhcyBhbnkpLmV0aGVyZXVtLnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdldGhfcmVxdWVzdEFjY291bnRzJ1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY2NvdW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc2VuZENvbm5lY3Rpb25SZXN1bHQoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiAnTm8gYWNjb3VudHMgZm91bmQuIFBsZWFzZSB1bmxvY2sgTWV0YU1hc2suJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBHZXQgdGhlIGNvbm5lY3RlZCBhY2NvdW50XG4gICAgICBjb25zdCBhY2NvdW50ID0gYWNjb3VudHNbMF07XG4gICAgICBcbiAgICAgIHNlbmRDb25uZWN0aW9uUmVzdWx0KHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgYWNjb3VudDogYWNjb3VudCxcbiAgICAgICAgY2hhaW5JZDogYXdhaXQgKHdpbmRvdyBhcyBhbnkpLmV0aGVyZXVtLnJlcXVlc3QoeyBtZXRob2Q6ICdldGhfY2hhaW5JZCcgfSlcbiAgICAgIH0pO1xuXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgbGV0IGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gY29ubmVjdCB0byBNZXRhTWFzayc7XG4gICAgICBcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSA0MDAxKSB7XG4gICAgICAgIGVycm9yTWVzc2FnZSA9ICdVc2VyIHJlamVjdGVkIHRoZSBjb25uZWN0aW9uIHJlcXVlc3QnO1xuICAgICAgfSBlbHNlIGlmIChlcnJvci5jb2RlID09PSAtMzIwMDIpIHtcbiAgICAgICAgZXJyb3JNZXNzYWdlID0gJ1BsZWFzZSBjaGVjayBNZXRhTWFzayAtIGNvbm5lY3Rpb24gcmVxdWVzdCBwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBzZW5kQ29ubmVjdGlvblJlc3VsdCh7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZW5kQ29ubmVjdGlvblJlc3VsdChyZXN1bHQ6IGFueSkge1xuICAgIHdpbmRvdy5wb3N0TWVzc2FnZSh7XG4gICAgICB0eXBlOiAnV0FMTEVUX0NPTk5FQ1RJT05fUkVTVUxUJyxcbiAgICAgIHBheWxvYWQ6IHJlc3VsdFxuICAgIH0sICcqJyk7XG4gIH1cbn0pOyJdLCJuYW1lcyI6WyJyZXN1bHQiXSwibWFwcGluZ3MiOiI7O0FBQU8sV0FBUyxxQkFBcUIsS0FBSztBQUN4QyxRQUFJLE9BQU8sUUFBUSxPQUFPLFFBQVEsV0FBWSxRQUFPLEVBQUUsTUFBTSxJQUFHO0FBQ2hFLFdBQU87QUFBQSxFQUNUO0FDSEEsUUFBQSxhQUFBLHFCQUFBLE1BQUE7QUFDRSxZQUFBLElBQUEsNENBQUE7QUFHQSxXQUFBLGlCQUFBLFdBQUEsT0FBQSxVQUFBO0FBRUUsVUFBQSxNQUFBLFdBQUEsT0FBQSxTQUFBLE9BQUE7QUFFQSxVQUFBLE1BQUEsS0FBQSxTQUFBLDRCQUFBLE1BQUEsS0FBQSxXQUFBLDhCQUFBO0FBR0UsWUFBQTtBQUNFLGdCQUFBLGtCQUFBO0FBQUEsUUFBd0IsU0FBQSxPQUFBO0FBRXhCLCtCQUFBO0FBQUEsWUFBcUIsU0FBQTtBQUFBLFlBQ1YsT0FBQSxpQkFBQSxRQUFBLE1BQUEsVUFBQTtBQUFBLFVBQ3VDLENBQUE7QUFBQSxRQUNqRDtBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUE7QUFHRixtQkFBQSxvQkFBQTtBQUVFLFVBQUEsT0FBQSxPQUFBLGFBQUEsYUFBQTtBQUNFLDZCQUFBO0FBQUEsVUFBcUIsU0FBQTtBQUFBLFVBQ1YsT0FBQTtBQUFBLFFBQ0YsQ0FBQTtBQUVUO0FBQUEsTUFBQTtBQUdGLFVBQUE7QUFFRSxjQUFBLFdBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQTtBQUFBLFVBQXdELFFBQUE7QUFBQSxRQUM5QyxDQUFBO0FBR1YsWUFBQSxTQUFBLFdBQUEsR0FBQTtBQUNFLCtCQUFBO0FBQUEsWUFBcUIsU0FBQTtBQUFBLFlBQ1YsT0FBQTtBQUFBLFVBQ0YsQ0FBQTtBQUVUO0FBQUEsUUFBQTtBQUlGLGNBQUEsVUFBQSxTQUFBLENBQUE7QUFFQSw2QkFBQTtBQUFBLFVBQXFCLFNBQUE7QUFBQSxVQUNWO0FBQUEsVUFDVCxTQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsRUFBQSxRQUFBLGNBQUEsQ0FBQTtBQUFBLFFBQ3lFLENBQUE7QUFBQSxNQUMxRSxTQUFBLE9BQUE7QUFHRCxZQUFBLGVBQUE7QUFFQSxZQUFBLE1BQUEsU0FBQSxNQUFBO0FBQ0UseUJBQUE7QUFBQSxRQUFlLFdBQUEsTUFBQSxTQUFBLFFBQUE7QUFFZix5QkFBQTtBQUFBLFFBQWUsV0FBQSxNQUFBLFNBQUE7QUFFZix5QkFBQSxNQUFBO0FBQUEsUUFBcUI7QUFHdkIsNkJBQUE7QUFBQSxVQUFxQixTQUFBO0FBQUEsVUFDVixPQUFBO0FBQUEsUUFDRixDQUFBO0FBQUEsTUFDUjtBQUFBLElBQ0g7QUFHRixhQUFBLHFCQUFBQSxTQUFBO0FBQ0UsYUFBQSxZQUFBO0FBQUEsUUFBbUIsTUFBQTtBQUFBLFFBQ1gsU0FBQUE7QUFBQSxNQUNHLEdBQUEsR0FBQTtBQUFBLElBQ0w7QUFBQSxFQUVWLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
