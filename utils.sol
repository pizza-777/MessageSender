pragma ton-solidity 0.58.1;

contract Utils{
    function getShardNumber(uint _addr) public pure returns(uint8){
        return uint8(_addr >> 252);
    }
}