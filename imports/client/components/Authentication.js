
const Authentication = ({ children, realType = false }) => {
    if (realType) {
        return children;
    }
    return null;
};


export default Authentication;
