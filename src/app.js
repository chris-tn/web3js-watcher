var wrapContract = require('./wrapContract');
var wrapContractSideChain = require('./sideChain/wrapContractSideChain');

 //wrapContract.adminSetToken('0x1d893910d30edc1281d97aecfe10aefeabe0c41b','BBO');

 let ownerAddress = '0x83e5353fC26643c29B041A3b692c6335c97A9aed';
 let privateKey = '0x52f0d9c78c406446a465651010e23766f47bc13dc19bd7ca30a10ac1d15ce7e4';
//  let admin = '0xAB8C9E08ec13B7c91210A68b08AFD382da99eaC1';
//  wrapContract.addAdmin(privateKey, ownerAddress, admin);




// wrapContract.mintToken('0x75A426f8136891afe4244347CE6931f5826E5Cc7', 'BBO', '10000000000000000000', '0x30475b9b17c2d5164c8c3ee96563edaa52cbca4162ec217b18028b05bba8ad99').then(function(data) {
//     console.log(data);
// });


let BEtherAddress = '0xfb8895d99e5293c189237285d789a342361c799a'; //rinkeby
let wrapContactAddress = '0xfe01e2c1ee0014c36a87d08f5951c8ea1a8e4b92';

//Side Chain function
 //wrapContractSideChain.adminSetToken(BEtherAddress,'BETH');


//  wrapContractSideChain.approveToken(privateKey, ownerAddress, BEtherAddress, wrapContactAddress).then(function(data) {
//         console.log(data);
// });

wrapContractSideChain.mintToken(wrapContactAddress,'0x75A426f8136891afe4244347CE6931f5826E5Cc7', 'BETH', '10000000000000000000', '0x30475b9b17c2d5164c8c3ee96563edaa52cbca4162ec217b18028b05bba8ad99').then(function(data) {
    console.log(data);
});