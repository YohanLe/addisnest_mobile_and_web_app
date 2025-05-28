import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageDropdown = () => {
    const { i18n } = useTranslation();
    const [showLanguage, setShowLanguage] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const selectRef = useRef();

    // useEffect(() => {
    //     const code = localStorage.getItem('language') || 'en';
    //     setSelectedLanguage(code === 'en' ? 'English' :
    //         code === 'hi' ? 'Hindi' :
    //         code === 'ur' ? 'Urdu' :
    //         code === 'ar' ? 'Arabic' : 'English');
    //     i18n.changeLanguage(code).catch((error) => {
    //         console.error("Error initializing language:", error);
    //     });
    //     const handleClickOutside = (event) => {
    //         if (selectRef.current && !selectRef.current.contains(event.target)) {
    //             setShowLanguage(false);
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [i18n]);

    // const handleLanguageChange = (language, code) => {
    //     i18n.changeLanguage(code);
    //     setSelectedLanguage(language);
    //     setShowLanguage(false);
    //     localStorage.setItem('language', code); 
    // };

    useEffect(() => {
        const code = localStorage.getItem('language') || 'en';
        setSelectedLanguage(
            code === 'en' ? 'English' :
            code === 'hi' ? 'Hindi' :
            code === 'ur' ? 'Urdu' :
            code === 'ar' ? 'Arabic' :
            code === 'tg' ? 'Tajik' :
            code === 'fa' ? 'Persian' :
            code === 'tr' ? 'Turkish' :
            code === 'id' ? 'Indonesian' :
            code === 'ms' ? 'Malaysian' :
            code === 'fr' ? 'French' :
            code === 'ru' ? 'Russian' :
            code === 'zh' ? 'Chinese' : 'English'
        );

        i18n.changeLanguage(code).catch((error) => {
            console.error("Error initializing language:", error);
        });

        if (['ar', 'ur', 'tg', 'fa'].includes(code)) {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }

        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setShowLanguage(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [i18n]);

    const handleLanguageChange = (language, code) => {
        i18n.changeLanguage(code);
        setSelectedLanguage(language);
        setShowLanguage(false);
        localStorage.setItem('language', code);
        if (code === 'ar' || code === 'ur') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }
    };

    return (
        <>
            <div className='language-main' ref={selectRef}>
                <p className='language-title' onClick={() => setShowLanguage((prev) => !prev)}>{selectedLanguage.substring(0, 3)}</p>
                {showLanguage && (
                    <div className='language-dropdown'>

                        <ul>
                            <li>
                                <span className={selectedLanguage === 'English' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('English', 'en')}>English</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Hindi' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Hindi', 'hi')}>Hindi</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Urdu' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Urdu', 'ur')}>Urdu</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Arabic' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Arabic', 'ar')}>Arabic</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Tajik' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Tajik', 'tg')}>Tajik</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Persian' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Persian', 'fa')}>Persian</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Turkish' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Turkish', 'tr')}>Turkish</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Indonesian' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Indonesian', 'id')}>Indonesian</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Malaysian' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Malaysian', 'ms')}>Malaysian</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'French' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('French', 'fr')}>French</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Russian' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Russian', 'ru')}>Russian</span>
                            </li>
                            <li>
                                <span className={selectedLanguage === 'Chinese' ? 'active' : ''}
                                    onClick={() => handleLanguageChange('Chinese', 'zh')}>Chinese</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default LanguageDropdown;
