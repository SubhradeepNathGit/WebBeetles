import Maintenance from "../../pages/common/Maintenance";

const MaintenanceGuard = ({ isMaintenance, children }) => {
    if (isMaintenance) {
        return <Maintenance />;
    }
    return children;
};

export default MaintenanceGuard;