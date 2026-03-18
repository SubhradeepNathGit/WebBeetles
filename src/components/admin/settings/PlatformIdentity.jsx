import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import SectionCard from '../common/SectionCard'
import Input from '../common/Input'

const PlatformIdentity = ({ settings }) => {

    return (
        <SectionCard icon={Globe} title="Platform Identity">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <Input disabled label="Platform Name" value={settings?.platform_name ?? 'N/A'} />
                <Input label="Tagline" value={settings?.tagline?? 'N/A'} />
                <Input label="Support Email" value={settings?.support_email?? 'N/A'} type="email" />
                <Input label="Support Phone" value={settings?.support_phone?? 'N/A'}  />
            </div>
        </SectionCard>
    )
}

export default PlatformIdentity