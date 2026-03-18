import { useEffect, useState } from "react";
import { getAppSettings } from "../../function/getAppSettings";

const useAppSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const data = await getAppSettings();
        if (mounted) setSettings(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading, error };
};

export default useAppSettings;