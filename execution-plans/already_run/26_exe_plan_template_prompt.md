
## Prompt for the AI agent:
Hello,
This is an idea execution plan that you must follow through in order to carry out the required execution plan correctly and run the idea through the end.
You must go through each phase of this plan all the time you run this meta prompt template whenever One write a prompt idea or instruction to be carry out.

The execution makes used of 9 layers: 

- L8: INTENT & IDEA LAYER
- L7: STRATEGY & GOVERNANCE LAYER (Accountability, Risk Appetite, Approvals)
- L6: GRCP & Compliance LAYER (Mapping to frameworks, Trust & Evidence mgmt) 
- L5: Security Controls (Enforcement mechanisms) Layer
- L4: DATA & PRIVACY LAYER
- L3: Quality Assurance (Testing, verification, validation) Layer
- L2: Delivery  (CI/CD, release, change mgmt) Layer
- L1: Product  (code, design, architecture, data model, docs,human experience and ecosystem) Layer
- L0: Runtime & Infrastructure (Cloud, network, storage, compute) Layer

the execution path to follow across time (horizontal flow) has the following phases in order (you must always execute them in order) :

1. IDEA
2. INTENT
3. GOVERN
4. DESIGN
5. BUILD
6. VERIFY
7. DEPLOY
8. OBSERVE & LEARN
9. COMPLIANCE & EVIDENCE
10. INDEPENT ASSURANCE

For specifications on layers and execution path phases read the content of the following folders when you reach each phase:

- for the main 9 layers
    - main folder location: ./af-iclme/layers/
    - all 9 layers are mapped inside with corresponding folders containing samples of what is expected to be produced by the layers
    - the folder mapping with the 9 layers will be quiet explicit as they are named with deep ressemblance

- for the execution path to be followed
    - main folder location: ./af-iclme/layers/timeline_layers
    - each layer contain a prompt and artifact folder specifying what it needs as input (prompts folder) and what is expected as output (artifacts folder)
    - when you come to each layer based on the idea or the prompt given to you, you have to first go into the prompt folder, reads and understand the prompt file for that phase, execute the necessary and also read the artifact_sample file to understand further how to produce the corresponding artifacts for that phase and from there carry out the necessary instruction to come out with the expected results


now with this context provided, this is the prompt to execute following all the context, information and instructions given above:

- prompt: >
  - always follow the execution plan steps and the instructions provided within. you need to use uv (/app/.venv/bin/uv) if you want to install deps and also use the venv present inside the container.
  - if you want to execute a cmd? first confirm approval and then read the docker-compose.generated.yml to know the service and use the venv (/app/.venv/bin/)
  - you must not have remove the section of the code in the frontend that create the service and the bot? (cause it's through that you get all the necessary ids)
  - forward-logs-shared.ts:95 [Fast Refresh] rebuilding
forward-logs-shared.ts:95 [Fast Refresh] done in 1291ms
page.tsx:30  Server  Error: Route "/dashboard/services/[id]" used `params.id`. `params` is a Promise and must be unwrapped with `await` or `React.use()` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ServiceDetails (page.tsx:30:45)
    at resolveErrorDev (react-server-dom-turbopack-client.browser.development.js:3180:48)
    at getOutlinedModel (react-server-dom-turbopack-client.browser.development.js:2417:22)
    at parseModelString (react-server-dom-turbopack-client.browser.development.js:2616:15)
    at Object.<anonymous> (react-server-dom-turbopack-client.browser.development.js:4536:18)
    at JSON.parse (<anonymous>)
    at initializeModelChunk (react-server-dom-turbopack-client.browser.development.js:1820:26)
    at getOutlinedModel (react-server-dom-turbopack-client.browser.development.js:2322:11)
    at parseModelString (react-server-dom-turbopack-client.browser.development.js:2712:15)
    at Array.<anonymous> (react-server-dom-turbopack-client.browser.development.js:4536:18)
    at JSON.parse (<anonymous>)
    at initializeModelChunk (react-server-dom-turbopack-client.browser.development.js:1820:26)
    at resolveConsoleEntry (react-server-dom-turbopack-client.browser.development.js:3471:13)
    at processFullStringRow (react-server-dom-turbopack-client.browser.development.js:4387:11)
    at processFullBinaryRow (react-server-dom-turbopack-client.browser.development.js:4283:7)
    at processBinaryChunk (react-server-dom-turbopack-client.browser.development.js:4506:19)
    at progress (react-server-dom-turbopack-client.browser.development.js:4780:9)
warn @ forward-logs-shared.ts:95
ServiceDetails @ page.tsx:30
react_stack_bottom_frame @ react-server-dom-turbopack-client.browser.development.js:4975
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:3473
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4387
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4283
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4506
progress @ react-server-dom-turbopack-client.browser.development.js:4780
<ServiceDetails>
Function.all @ VM1818 <anonymous>:1
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:3373
react_stack_bottom_frame @ react-server-dom-turbopack-client.browser.development.js:4972
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:3473
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4387
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4283
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4506
progress @ react-server-dom-turbopack-client.browser.development.js:4780
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2767
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4641
exports.createFromFetch @ react-server-dom-turbopack-client.browser.development.js:5012
createFromNextFetch @ fetch-server-response.ts:467
createFetch @ fetch-server-response.ts:353
fetchServerResponse @ fetch-server-response.ts:174
navigateDynamicallyWithNoPrefetch @ navigation.ts:522
navigate @ navigation.ts:192
navigateReducer @ navigate-reducer.ts:165
clientReducer @ router-reducer.ts:30
action @ app-router-instance.ts:221
runAction @ app-router-instance.ts:101
dispatchAction @ app-router-instance.ts:178
dispatch @ app-router-instance.ts:219
(anonymous) @ use-action-queue.ts:51
startTransition @ react-dom-client.development.js:9210
dispatch @ use-action-queue.ts:50
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:290
(anonymous) @ app-router-instance.ts:369
startTransition @ react.development.js:554
push @ app-router-instance.ts:368
handleFormSubmit @ page.tsx:309
await in handleFormSubmit
executeDispatch @ react-dom-client.development.js:20543
runWithFiberInDEV @ react-dom-client.development.js:986
processDispatchQueue @ react-dom-client.development.js:20593
(anonymous) @ react-dom-client.development.js:21164
batchedUpdates$1 @ react-dom-client.development.js:3377
dispatchEventForPluginEventSystem @ react-dom-client.development.js:20747
dispatchEvent @ react-dom-client.development.js:25693
dispatchDiscreteEvent @ react-dom-client.development.js:25661
%5Broot-of-the-server%5D__48eae242._.js?14:363  Server  Failed to fetch service: TypeError: fetch failed
    at getService (%5Broot-of-the-server%5D__48eae242._.js?12:355:26)
    at ServiceDetails (page.tsx:30:21)
    at resolveErrorDev (react-server-dom-turbopack-client.browser.development.js:3180:48)
    at getOutlinedModel (react-server-dom-turbopack-client.browser.development.js:2417:22)
    at parseModelString (react-server-dom-turbopack-client.browser.development.js:2616:15)
    at Object.<anonymous> (react-server-dom-turbopack-client.browser.development.js:4536:18)
    at JSON.parse (<anonymous>)
    at initializeModelChunk (react-server-dom-turbopack-client.browser.development.js:1820:26)
    at getOutlinedModel (react-server-dom-turbopack-client.browser.development.js:2322:11)
    at parseModelString (react-server-dom-turbopack-client.browser.development.js:2712:15)
    at Array.<anonymous> (react-server-dom-turbopack-client.browser.development.js:4536:18)
    at JSON.parse (<anonymous>)
    at initializeModelChunk (react-server-dom-turbopack-client.browser.development.js:1820:26)
    at resolveConsoleEntry (react-server-dom-turbopack-client.browser.development.js:3471:13)
    at processFullStringRow (react-server-dom-turbopack-client.browser.development.js:4387:11)
    at processFullBinaryRow (react-server-dom-turbopack-client.browser.development.js:4283:7)
    at processBinaryChunk (react-server-dom-turbopack-client.browser.development.js:4506:19)
    at progress (react-server-dom-turbopack-client.browser.development.js:4780:9)
error @ intercept-console-error.ts:42
getService @ %5Broot-of-the-server%5D__48eae242._.js?14:363
ServiceDetails @ page.tsx:30
react_stack_bottom_frame @ react-server-dom-turbopack-client.browser.development.js:4975
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:3473
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4387
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4283
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4506
progress @ react-server-dom-turbopack-client.browser.development.js:4780
<ServiceDetails>
Function.all @ VM1818 <anonymous>:1
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:3373
react_stack_bottom_frame @ react-server-dom-turbopack-client.browser.development.js:4972
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:3473
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4387
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4283
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4506
progress @ react-server-dom-turbopack-client.browser.development.js:4780
react-server-dom-turbopack-client.browser.development.js:3759 Uncaught TypeError: Failed to execute 'measure' on 'Performance': '​ServiceDetails' cannot have a negative time stamp.
    at flushComponentPerformance (react-server-dom-turbopack-client.browser.development.js:3759:35)
    at flushComponentPerformance (react-server-dom-turbopack-client.browser.development.js:3674:27)
    at flushInitialRenderPerformance (react-server-dom-turbopack-client.browser.development.js:4120:11)
flushComponentPerformance @ react-server-dom-turbopack-client.browser.development.js:3759
flushComponentPerformance @ react-server-dom-turbopack-client.browser.development.js:3674
flushInitialRenderPerformance @ react-server-dom-turbopack-client.browser.development.js:4120
setTimeout
releasePendingChunk @ react-server-dom-turbopack-client.browser.development.js:1474
triggerErrorOnChunk @ react-server-dom-turbopack-client.browser.development.js:1611
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4344
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4283
processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4506
progress @ react-server-dom-turbopack-client.browser.development.js:4780
Promise.then
progress @ react-server-dom-turbopack-client.browser.development.js:4781
Promise.then
progress @ react-server-dom-turbopack-client.browser.development.js:4781
Promise.then
progress @ react-server-dom-turbopack-client.browser.development.js:4781
Promise.then
progress @ react-server-dom-turbopack-client.browser.development.js:4781
Promise.then
progress @ react-server-dom-turbopack-client.browser.development.js:4781
Promise.then
startReadingFromStream @ react-server-dom-turbopack-client.browser.development.js:4788
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:5031
forward-logs-shared.ts:95 [Fast Refresh] rebuilding
forward-logs-shared.ts:95 [Fast Refresh] done in 391ms

correct this
now go adhead and perform everything







  - when finished, copy this file in the folder /already_run  under the execution-plans folder and indicate the correct numbering as the previous one, it is used to keep track of all the prompting
  - save also a copy of the walkthrough file you usually produce in the corresponding CHG-id folder for tracking as well

    
