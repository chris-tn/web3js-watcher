var wrapContract = require('./mainChain/wrapContract');
var wrapContractSideChain = require('./sideChain/wrapContractSideChain');


let tokenBBC_Address_SideChain = '0xdfb70120219f0ca286cf31fb88c3cbcd44343b65';
let tokenBOP_Address_SideChain = '0x10bf3da19b64007a7d5fd517dd3c7686da53ffa0';

let wrapContactSideChainAddress = '0xfe01e2c1ee0014c36a87d08f5951c8ea1a8e4b92';


 //wrapContract.adminSetToken('0x1d893910d30edc1281d97aecfe10aefeabe0c41b','BBO');

 let ownerAddress = '0x83e5353fC26643c29B041A3b692c6335c97A9aed';
 let privateKey = '0x52f0d9c78c406446a465651010e23766f47bc13dc19bd7ca30a10ac1d15ce7e4';
//  let admin = '0xAB8C9E08ec13B7c91210A68b08AFD382da99eaC1';
//  wrapContract.addAdmin(privateKey, ownerAddress, admin);


wrapContract.depositToken(privateKey, ownerAddress,'0x1d893910d30edc1281d97aecfe10aefeabe0c41b', '10', 2000000, '10').then(function(data) {
    console.log(data);
});
    

// wrapContract.mintToken('0x75A426f8136891afe4244347CE6931f5826E5Cc7', 'BBO', '10000000000000000000', '0x30475b9b17c2d5164c8c3ee96563edaa52cbca4162ec217b18028b05bba8ad99').then(function(data) {
//     console.log(data);
// });


// let BEtherAddress = '0xfb8895d99e5293c189237285d789a342361c799a'; //rinkeby
// let wrapContactAddress = '0xfe01e2c1ee0014c36a87d08f5951c8ea1a8e4b92';

//Side Chain function
//wrapContractSideChain.adminSetToken(tokenBOP_Address_SideChain, 'BOP', 2000000, '10');


//  wrapContractSideChain.tokenTransferOwnership(privateKey, ownerAddress, tokenBOP_Address_SideChain, wrapContactSideChainAddress, 2000000, '10').then(function(data) {
//         console.log(data);
// });

// wrapContractSideChain.mintToken('0xb10ca39DFa4903AE057E8C26E39377cfb4989551', 'BOP', '980000000000000000000', '0x51475b9b17c2d5164c8c3ee96563edaa52cbca4762ec217b38028b05bba8ad99', 2000000, '10').then(function(data) {
//     console.log(data);
// });