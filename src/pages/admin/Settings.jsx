import React, { useEffect, useState } from "react";
import { ShoppingCart, Globe } from "lucide-react";
import SectionCard from "../../components/admin/common/SectionCard";
import Input from "../../components/admin/common/Input";
import SettingsHeader from "../../components/admin/settings/SettingsHeader";
import PlatformIdentity from "../../components/admin/settings/PlatformIdentity";
import PlatformToggle from "../../components/admin/settings/PlatformToggle";
import SystemStatus from "../../components/admin/settings/SystemStatus";
import PlatformSummary from "../../components/admin/settings/PlatformSummary";
import DangerZone from "../../components/admin/settings/DangerZone";
import Certification from "../../components/admin/settings/Certification";
import useAppSettings from "../../tanstack/query/fetchAppSettings";
import { fetchCodes } from "../../redux/slice/promocodeSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharges } from "../../redux/slice/chargesSlice";
import ConfirmStatusModal from "../../components/admin/common/modal/ConfirmStatusModal";
import { fetchplatform, updateMaintenanceMode } from "../../redux/slice/platformSlice";
import getSweetAlert from "../../util/alert/sweetAlert";
import hotToast from "../../util/alert/hot-toast";

export default function Settings() {

    const [cartEnabled, setCartEnabled] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const [settings, setSettings] = useState(null);

    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [maintenanceId, setMaintenanceId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(false);

    const dispatch = useDispatch(),
        { isPlatformLoading, allPlatformDetails, hasPlatformError } = useSelector(state => state?.platform),
        { isCodeLoading, isCodeStatusLoading, allCode, hasCodesError } = useSelector(state => state?.promocode),
        { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

    useEffect(() => {
        dispatch(fetchCodes())
            .then(res => {
                // console.log('Response for fetching all courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            });
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCharges())
            .then(res => {
                // console.log('Response for fetching all courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchplatform())
            .then(res => {
                // console.log('Response for fetching all courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    useEffect(() => {
        setSettings(allPlatformDetails?.[0]);

        setMaintenanceMode(allPlatformDetails?.[0]?.maintenance_mode);
        setMaintenanceId(allPlatformDetails?.[0]?.id);
        setChangeStatus(!allPlatformDetails?.[0]?.maintenance_mode);
    }, [allPlatformDetails]);


    const updateMaintenanceStatus = () => {
        dispatch(updateMaintenanceMode({ id: maintenanceId, updatedData: changeStatus }))
            .then(res => {
                // console.log('Response for updating maintenance mode', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(fetchplatform())
                    hotToast(`Maintenance mode turn ${changeStatus ? 'on' : 'off'} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while turning ${changeStatus ? 'on' : 'off'} maintenance mode.`, "error");
            })
    }

    // console.log(allPlatformDetails);

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <SettingsHeader />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Platform Identity */}
                        <PlatformIdentity settings={settings} />

                        {/* Platform Toggles */}
                        <PlatformToggle cartEnabled={cartEnabled} setCartEnabled={setCartEnabled} maintenanceMode={maintenanceMode}
                            setOpenMarkModal={setOpenMarkModal} />

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <SystemStatus />

                        <PlatformSummary cartEnabled={cartEnabled} maintenanceMode={maintenanceMode} promoCodes={allCode} tax={allCharges} />

                        <Certification />

                        <DangerZone />
                    </div>
                </div>
            </div>

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={updateMaintenanceStatus} isLoading={isPlatformLoading}
                    title={`Maintenance mode ${changeStatus ? 'on' : 'off'}`} subTitle={`Are you sure you want to ${changeStatus ? 'on' : 'off'} the maintenance mode`} />
            )}
        </>
    );
}
