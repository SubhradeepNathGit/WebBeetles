import { ChevronRight } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, linkTo, linkLabel = "View All" }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {linkTo && (
                <Link to={linkTo} className="text-xs text-purple-400 hover:text-yellow-400 flex items-center gap-1 transition-colors">
                    {linkLabel} <ChevronRight size={14} />
                </Link>
            )}
        </div>
    );
}

export default SectionHeader;