document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const periodicTableDiv = document.getElementById('periodic-table');
    const currentFormulaDiv = document.getElementById('current-formula');
    const feedbackDiv = document.getElementById('feedback');
    const scoreSpan = document.getElementById('score');
    const timerSpan = document.getElementById('timer');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalScoreSpan = document.getElementById('final-score');
    const restartGameBtn = document.getElementById('restart-game-btn');

    // --- Game State ---
    let elementsData = [];
    let currentFormula = [];
    let score = 0;
    let timeLeft = 120; // 2 minutes
    let timerId = null;
    let gameActive = false;
    let foundFormulas = new Set();

    // A comprehensive set of valid chemical formulas for validation
    const validFormulas = new Set([
        'Ac2O3', 'Ag2C2', 'Ag2C2O4', 'Ag2CO3', 'Ag2Cl2', 'Ag2Cr2O7', 'Ag2CrO4', 'Ag2F', 'Ag2MoO4', 'Ag2O', 'Ag2S', 'Ag2SO4', 'Ag2Se', 'Ag2SeO3', 'Ag2SeO4', 'Ag2Te', 'Ag3Br2', 'Ag3Br3', 'Ag3Cl3', 'Ag3I3', 'Ag3PO4', 'AgBF4', 'AgBr', 'AgBrO', 'AgBrO2', 'AgBrO3', 'AgBrO4', 'AgCN', 'AgCNO', 'AgCl', 'AgCl3Cu2', 'AgClO3', 'AgClO4', 'AgF', 'AgF2', 'AgI', 'AgIO', 'AgIO2', 'AgIO3', 'AgIO4', 'AgMnO4', 'AgN3', 'AgNO3', 'AgO', 'AgONC', 'AgPF6', 'AgSNC', 'Al(NO2)3', 'Al(NO3)3', 'Al(OH)3', 'Al2(CO3)3', 'Al2(SO4)3', 'Al2BeO4', 'Al2Br6', 'Al2Cl9K3', 'Al2CoO4', 'Al2F6', 'Al2I6', 'Al2MgO4', 'Al2O', 'Al2O2', 'Al2O3', 'Al2O5Si', 'Al2O7Si2', 'Al2S', 'Al2S3', 'Al2Se', 'Al2Si2O5(OH)4', 'Al2SiO5', 'Al2Te', 'Al3F14Na5', 'Al4C3', 'Al6BeO10', 'Al6O13Si2', 'AlBO3', 'AlBr', 'AlBr3', 'AlCl', 'AlCl2F', 'AlCl2H', 'AlCl3', 'AlCl4Cs', 'AlCl4K', 'AlCl4Na', 'AlCl4Rb', 'AlCl6K3', 'AlCl6Na3', 'AlClF', 'AlClO', 'AlCo', 'AlF', 'AlF2', 'AlF2O', 'AlF3', 'AlF4K', 'AlF4Li', 'AlF6K3', 'AlF6Li3', 'AlF6Na3', 'AlFO', 'AlGaInP', 'AlH3', 'AlH4', 'AlI', 'AlI3', 'AlLiO2', 'AlN', 'AlNaO2', 'AlO', 'AlO2', 'AlOSi', 'AlP', 'AlPO4', 'AlTe', 'AlTe2', 'ArClF', 'ArClH', 'ArFH', 'As2I4', 'As2Mg3', 'As2O3', 'As2O5', 'As2P2', 'As2S4', 'As2S5', 'As2Se', 'As2Se3', 'As2Se5', 'As3O4', 'As3P', 'As4O3', 'As4O5', 'As4S3', 'As4S4', 'AsBr3', 'AsBrO', 'AsCl3', 'AsCl3O', 'AsCl4F', 'AsClO', 'AsF3', 'AsF5', 'AsH3', 'AsI3', 'AsO', 'AsO2', 'AsP', 'AsP3', 'AsTl', 'Au(OH)3', 'Au2(SeO4)3', 'Au2O3', 'Au2S', 'Au2S3', 'Au2Se3', 'AuB', 'AuBO', 'AuBr', 'AuBr3', 'AuCN', 'AuCl', 'AuCl3', 'AuF3', 'AuI', 'AuI3', 'AuTe', 'B(NO3)3', 'B(NO3)4', 'B(OH)3', 'B2Cl4', 'B2F4', 'B2H2Se3', 'B2H6', 'B2Mg', 'B2O3', 'B2S3', 'B3N3H6', 'B4C', 'B4CaO7', 'B4Na2O7.10H2O', 'BAs', 'BBr3', 'BCl3', 'BF3', 'BH3', 'BH4', 'BH6N', 'BI3', 'BN', 'BO33-', 'BP', 'BPO4', 'BX-912', 'Ba(AlO2)2', 'Ba(AsO3)2', 'Ba(AsO4)2', 'Ba(BrO)2', 'Ba(BrO2)2', 'Ba(BrO3)2', 'Ba(BrO3)2·2H2O', 'Ba(BrO3)2·H2O', 'Ba(BrO4)2', 'Ba(BrO4)2·3H2O', 'Ba(BrO4)2·4H2O', 'Ba(C2H3O2)2', 'Ba(CHO2)2', 'Ba(CN)2', 'Ba(HS)2', 'Ba(IO)2', 'Ba(IO2)2', 'Ba(IO3)2', 'Ba(IO4)2', 'Ba(MnO4)2', 'Ba(NO2)2', 'Ba(NO3)2', 'Ba(NbO3)2', 'Ba(OH)2', 'Ba(PO3)2', 'Ba(SCN)2', 'Ba(SeCN)2', 'Ba2Na(NbO3)5', 'Ba2P2O7', 'Ba2V2O7', 'Ba2XeO6', 'Ba3(CrO4)2', 'Ba3(PO4)2', 'Ba3(VO4)2', 'Ba3N2', 'BaB6', 'BaBr2', 'BaHfO3', 'BaHgI4', 'BaI2', 'BaK2(CrO4)2', 'BaMnO4', 'BaMoO4', 'BaN6', 'BaNb2O6', 'BaO', 'BaO2', 'BaS', 'BaS2O3', 'BaSO3', 'BaSO4', 'BaSe', 'BaSeO3', 'BaSeO4', 'BaSi2', 'BaSi2O5', 'BaSiF6', 'BaSiO3', 'BaSnO3', 'BaTeO3', 'BaTeO4·3H2O', 'BaTiO3', 'BaU2O7', 'BaWO4', 'BaZrO3', 'Be(BH4)2', 'Be(C2H3O2)2', 'Be(C5H7O2)2', 'Be(CHO2)2', 'Be(ClO)2', 'Be(ClO3)2', 'Be(ClO4)2', 'Be(NO2)2', 'Be(NO3)2', 'Be(OH)2', 'Be2C', 'Be3Al2(SiO3)6', 'Be3N2', 'BeB2', 'BeBr2', 'BeCO3', 'BeCl2', 'BeF2', 'BeI2', 'BeO', 'BeS', 'BeSO3', 'BeSO4', 'Bi(C2H3O2)3', 'Bi(NO3)3·5H2O', 'Bi(VO3)5', 'Bi2(MoO4)3', 'Bi2O3', 'Bi2S3', 'Bi2Se3', 'BiBO3', 'BiBr3', 'BiC6H5O7', 'BiCl3', 'BiF3', 'BiI3', 'BiOCl', 'BiOI', 'BiPO4', 'Br2', 'Br2O5', 'Br3-', 'Br5-', 'BrCl', 'BrCl3', 'BrCl5', 'BrF', 'BrF3', 'BrF5', 'BrI', 'BrO3', 'C(CN)4', 'C(NH2)3NO3', 'C10H10N2O', 'C10H10N3NaO5', 'C10H10O2', 'C10H10O4', 'C10H11N3O3S', 'C10H12N2', 'C10H12O', 'C10H12O2', 'C10H12O3', 'C10H13N5O4', 'C10H14Cl2O4Ti', 'C10H14ClNS', 'C10H14O', 'C10H15Br', 'C10H15ON', 'C10H16', 'C10H16O', 'C10H17NO3', 'C10H18N2O8', 'C10H18N4O2S', 'C10H19NO3', 'C10H20N2O2', 'C10H20O2', 'C10H22', 'C10H4Br5NO', 'C10H7N3S', 'C10H7NO2', 'C10H7NO4', 'C10H8', 'C10H8O3', 'C10H9N5O', 'C10H9NO2', 'C11H10O', 'C11H11NO2', 'C11H12N2O2', 'C11H12O3', 'C11H13NO6', 'C11H14N2O', 'C11H14O2', 'C11H16O2', 'C11H19NO4', 'C11H21N5O5', 'C11H24', 'C11H8O2', 'C12H10', 'C12H10ClN2O5S', 'C12H11N3O2', 'C12H11N5', 'C12H11N7', 'C12H11NO5', 'C12H13NO2', 'C12H14O4', 'C12H15NO', 'C12H16N2', 'C12H16O3', 'C12H16O4', 'C12H16O7', 'C12H17N5O4S', 'C12H18N4O2', 'C12H18O', 'C12H18O4', 'C12H19N3O7', 'C12H21N3O8', 'C12H22O11', 'C12H22O4', 'C12H25N', 'C12H26', 'C12H4Cl6', 'C12H4N4', 'C12H8O4', 'C131H200N30O43S2', 'C13H10O', 'C13H12F2N6O', 'C13H12O', 'C13H12O2', 'C13H14N2O', 'C13H16N2O2', 'C13H18O2', 'C13H20', 'C13H28', 'C14H10', 'C14H10O14', 'C14H11Cl3N2O3', 'C14H11NO3', 'C14H12O3', 'C14H13F4N3O2S', 'C14H14Cl2N2O', 'C14H16N2O4', 'C14H17F3N3O2', 'C14H18N2O5', 'C14H18N4O3', 'C14H18O6', 'C14H20O5', 'C14H30', 'C158H251N39O46S', 'C15H10O4', 'C15H10O5', 'C15H10O6', 'C15H10O7', 'C15H12N2O', 'C15H12N2O2', 'C15H13NO4', 'C15H18O2', 'C15H18O3', 'C15H24O', 'C15H32', 'C161H236N42O48', 'C164H256Na2O68S2', 'C169', 'C16H13NO4', 'C16H14O3', 'C16H19NO4', 'C16H19NO5', 'C16H22FN5O3S', 'C16H28N2O6Zn', 'C16H30N4O4S', 'C16H34', 'C172H284ClN53O41', 'C17H13ClN4', 'C17H14F3N3O2S', 'C17H14N2', 'C17H14N2O5S', 'C17H14O3', 'C17H15NO3', 'C17H16N2O3S', 'C17H18N2O6', 'C17H19N3O3S', 'C17H21NO4', 'C17H22O2', 'C17H24O', 'C17H24O9', 'C17H30O8', 'C17H36', 'C18H12Cl2N2O', 'C18H16N2OS', 'C18H17NO3', 'C18H17NO7', 'C18H22O2', 'C18H23NO6', 'C18H24O2', 'C18H24O3', 'C18H24O4', 'C18H27NO3', 'C18H32O2', 'C18H36O2', 'C18H38', 'C19H10Br2O9S', 'C19H12N2O', 'C19H14N2O4', 'C19H14O6', 'C19H15ClO4', 'C19H16ClNO4', 'C19H22N2', 'C19H22N2O', 'C19H24N2O', 'C19H26O2', 'C19H28O2', 'C19H30O2', 'C19H40', 'C20H17NO6', 'C20H19N', 'C20H20N4AgS2O8', 'C20H22N2O', 'C20H22N2O2', 'C20H22O7', 'C20H23BrN8O', 'C20H23NO4', 'C20H24O2N2', 'C20H25NO', 'C20H26O3', 'C20H27NO11', 'C20H28O2', 'C20H30O3', 'C20H32O5', 'C20H34O5', 'C20H42', 'C21H16FN7', 'C21H18FN5O5S', 'C21H19ClN4O2', 'C21H20O6', 'C21H22N2O4', 'C21H22O4', 'C21H23FN2O4', 'C21H24FN6O6P', 'C21H25NO4', 'C21H26O4', 'C21H27N5', 'C21H30O2', 'C21H36N7O16P3S', 'C21H39NO3', 'C21H44N2', 'C22H23ClN2O2', 'C22H26O7', 'C22H28N2O', 'C22H30O8', 'C23H13Cl2Na3O9S', 'C23H19ClF3NO3', 'C23H24O4S', 'C23H28N2O', 'C23H28N2O4', 'C23H38N2OS', 'C23H41NO2', 'C24H17F6NO3', 'C24H29FN6', 'C24H45CrO6', 'C25H30O8', 'C25H36O6', 'C26H32N6O11', 'C26H37N3O', 'C26H38O6', 'C27H27Cl2N5O3S', 'C27H33N3O5', 'C27H50O6', 'C286', 'C28H26ClN5O', 'C28H37NO8', 'C28H42N4O6', 'C28H47NO3', 'C29H40N2O6', 'C29H42N10O9', 'C2F4', 'C2H2', 'C2H2O2', 'C2H3Cl', 'C2H3NO', 'C2H3O2', 'C2H4', 'C2H4Cl2', 'C2H4N4', 'C2H4O', 'C2H4O2', 'C2H5Br', 'C2H5NH2', 'C2H5NO2', 'C2H5O', 'C2H5OCs', 'C2H5OH', 'C2H5OK', 'C2H5ONa', 'C2H5ORb', 'C2H6', 'C2H6OS', 'C2H7NO', 'C2H7NO2', 'C2H7NO3S', 'C2O42', 'C30H19NO9', 'C30H42O11', 'C30H46O6', 'C33H28O9', 'C33H38O11', 'C34H46O18', 'C35H42O14', 'C35H60O6', 'C36N2O6', 'C37H44O13', 'C37H48N2O8', 'C37H59N5O6', 'C37H64O6', 'C38H65NO29', 'C39H48N2O9', 'C3H3Cl3', 'C3H3N', 'C3H3O4', 'C3H4', 'C3H4N2', 'C3H4N2S', 'C3H4O3', 'C3H4O4', 'C3H5N3', 'C3H5N3O9', 'C3H5NO', 'C3H6', 'C3H6O2', 'C3H6O2S', 'C3H7N', 'C3H7N3', 'C3H7NO2', 'C3H7NO2S', 'C3H7NO3', 'C3H7P', 'C3H8', 'C3H8NO5P', 'C3H8O', 'C3H8O2', 'C3H8O3', 'C3H9N3', 'C3HN', 'C3N12', 'C3N3(OH)3', 'C40H48N6O10', 'C40H53NO14', 'C40H56', 'C40H60BNaO14', 'C41H50N2O10', 'C41H50N2O11', 'C44H55NO16', 'C44H69N15O9S', 'C48H56N10O12S6', 'C4H10', 'C4H10O', 'C4H10O2', 'C4H10O3', 'C4H11NO2', 'C4H2', 'C4H2BrClN2', 'C4H2Cl2N2', 'C4H3Cl2N3', 'C4H3FN2O2', 'C4H4', 'C4H4FN3O', 'C4H4N2O2', 'C4H4N4', 'C4H4O', 'C4H5FO2', 'C4H5N3O', 'C4H6N2', 'C4H6N2S', 'C4H6N4O', 'C4H6O2', 'C4H6O3', 'C4H6O4', 'C4H7BrO2', 'C4H7KO3', 'C4H7NO2', 'C4H7NO3', 'C4H7NO4', 'C4H7NaO3', 'C4H8', 'C4H8N2O3', 'C4H8O', 'C4H8O2', 'C4H8O3', 'C4H9ClHg', 'C4H9Li', 'C4H9NO2', 'C4H9NO3', 'C4H9Na', 'C4H9OH', 'C4HCl2FN2', 'C4I2', 'C52H48MoN4P4', 'C55H74IN3O21S4', 'C58H84N12O26', 'C59H103N3O18', 'C59H80N4O22S4', 'C5H10', 'C5H10N2O3', 'C5H10O2', 'C5H10O4', 'C5H11NO2', 'C5H11NO2S', 'C5H12', 'C5H12O2', 'C5H12O4', 'C5H12O5', 'C5H13N', 'C5H3Br2N', 'C5H3BrN2O2', 'C5H3ClN2O2', 'C5H3ClN4', 'C5H4N2O2', 'C5H4N2O4', 'C5H4N4O', 'C5H4N4O2', 'C5H4N4S', 'C5H4NCOOH', 'C5H4O', 'C5H4O2', 'C5H4O2S', 'C5H5', 'C5H5BrN2', 'C5H5ClN2', 'C5H5IN2', 'C5H5N', 'C5H5N3O', 'C5H5N3O2', 'C5H5N5', 'C5H5N5O', 'C5H5NO', 'C5H6BNO2', 'C5H6N2', 'C5H6N2O2', 'C5H6N2OS', 'C5H6O', 'C5H6O5', 'C5H7N3', 'C5H8O2', 'C5H9NO', 'C5H9NO2', 'C5H9NO4', 'C60', 'C61H60N14O18S5', 'C62H89CoN13O15P', 'C63H88CoN14O14P', 'C63H91CoN13O14P', 'C6F5COOH', 'C6H10O2', 'C6H10O3', 'C6H10O4', 'C6H11NO2', 'C6H12', 'C6H12N4O3', 'C6H12O3', 'C6H12O6', 'C6H12OS', 'C6H13NO', 'C6H13NO2', 'C6H14', 'C6H14N2O2', 'C6H14N4O2', 'C6H14O2', 'C6H14O3', 'C6H14O4', 'C6H15NO3', 'C6H2Cl3NO', 'C6H3Br3O', 'C6H3Cl3O', 'C6H4BrNO2', 'C6H4ClN3', 'C6H4ClNO2', 'C6H4N4', 'C6H4O2', 'C6H5Br', 'C6H5CH2OH', 'C6H5CHO', 'C6H5COCl', 'C6H5COO', 'C6H5COOH', 'C6H5Cl', 'C6H5F', 'C6H5I', 'C6H5NO2', 'C6H5NO3', 'C6H5NO4', 'C6H5O73', 'C6H5OH', 'C6H6', 'C6H6BClO2', 'C6H6BFO2', 'C6H6ClN', 'C6H6IN', 'C6H6N2O', 'C6H6N2O2', 'C6H6N4', 'C6H6O', 'C6H6O2', 'C6H6O3', 'C6H7BO2', 'C6H7CsO6', 'C6H7KO6', 'C6H7LiO6', 'C6H7N3O', 'C6H7N3O3', 'C6H7NaO6', 'C6H7RbO6', 'C6H8N2', 'C6H8N2O2S', 'C6H8O7', 'C6H9N3O2', 'C6H9N3O3', 'C6N4', 'C72H100CoN18O17P', 'C76H52O46', 'C77H101N17O26', 'C77H120N18O26S', 'C79H145N17O17', 'C7H10N2', 'C7H11NO5', 'C7H12N2O4', 'C7H12O4', 'C7H14O3', 'C7H14O6', 'C7H16', 'C7H4ClFO', 'C7H5Br3O', 'C7H5BrO', 'C7H5Cl2NS', 'C7H5Cl3O', 'C7H5F3O', 'C7H5FO2', 'C7H5N3O2', 'C7H5NO4', 'C7H5NS2', 'C7H6ClF', 'C7H6N2', 'C7H6O', 'C7H6O2', 'C7H6O3', 'C7H6O4', 'C7H6O5', 'C7H7BO4', 'C7H7N3', 'C7H7NO2', 'C7H7NO3', 'C7H8', 'C7H8ClN3O4S2', 'C7H8N4O2', 'C7H9BO2', 'C7H9BO3', 'C83H131N19O27S', 'C8H10IN', 'C8H10N4O2', 'C8H11N5O3', 'C8H11NO', 'C8H16', 'C8H16O2', 'C8H16O6', 'C8H18', 'C8H4F3IO2', 'C8H5F3N2OS', 'C8H5NO2', 'C8H6BrN', 'C8H6Cl2O3', 'C8H6ClN', 'C8H6N2O', 'C8H6N2O2', 'C8H7Cl', 'C8H7N', 'C8H7NO', 'C8H8', 'C8H8N2OS', 'C8H8O3', 'C8H8O4', 'C8H9NO2', 'C9H10O', 'C9H10O3', 'C9H11NO2', 'C9H11NO3', 'C9H11NO4', 'C9H12O3', 'C9H13N5O3', 'C9H14O3', 'C9H17NO2', 'C9H18N2O2', 'C9H20', 'C9H20N2O2S2', 'C9H20N2S', 'C9H6BrN', 'C9H6N2', 'C9H6O3', 'C9H6OS', 'C9H7NO', 'C9H7NO2', 'C9H8N2', 'C9H8O2', 'C9H8O3', 'C9H8O4', 'C9H9N', 'C9H9NO', 'C9H9NO3', 'C9H9NO6', 'CAgO', 'CCl2F2', 'CCl4', 'CF3Cl', 'CF4', 'CFCl2CF2Cl', 'CFCl3', 'CH(CN)3', 'CH2', 'CH2(CN)2', 'CH2(OH)2', 'CH2Ag', 'CH2CHCHCH2', 'CH2CHOH', 'CH2CO', 'CH2Cl2', 'CH2ClCOOH', 'CH2ClF', 'CH2O', 'CH2OHCH2OH', 'CH3(CH2)16COOH', 'CH3CCH', 'CH3CH2Br', 'CH3CH2CH2CH2OH', 'CH3CH2CH2OH', 'CH3CH2CONH2', 'CH3CH2COOH', 'CH3CH2OCH2CH3', 'CH3CH2OH', 'CH3CHCH2', 'CH3CHCHCH3', 'CH3CHO', 'CH3CN', 'CH3COCH3', 'CH3COCl', 'CH3CONH2', 'CH3COO', 'CH3COO(CH2)2CH(CH3)2', 'CH3COOCH2C6H5', 'CH3COOCH3', 'CH3COOCHCH2', 'CH3COOCs', 'CH3COOH', 'CH3COOK', 'CH3COONa', 'CH3COORb', 'CH3CdCH3', 'CH3Cl', 'CH3ClO4', 'CH3HgCH3', 'CH3I', 'CH3NH2', 'CH3NO', 'CH3OCH3', 'CH3OCs', 'CH3OH', 'CH3OK', 'CH3OLi', 'CH3ONa', 'CH3ORb', 'CH3SCH3', 'CH3SH', 'CH4', 'CH4N2O2', 'CH5N3', 'CHCl3', 'CHClF2', 'CHN3O6', 'CHNO', 'CHO2', 'CN', 'CNO', 'CO', 'CO2', 'CO3', 'CO32', 'COCl2', 'CS2', 'Ca(BrO)2', 'Ca(BrO2)2', 'Ca(BrO3)2', 'Ca(BrO4)2', 'Ca(C2H3O2)2', 'Ca(CHO2)2', 'Ca(CN)2', 'Ca(ClO)2', 'Ca(ClO2)2', 'Ca(ClO3)2', 'Ca(ClO4)2', 'Ca(H2PO2)2', 'Ca(HS)2', 'Ca(IO)2', 'Ca(IO2)2', 'Ca(IO3)2', 'Ca(IO4)2', 'Ca(NO2)2', 'Ca(NO3)2', 'Ca(NO3)2·4H2O', 'Ca(NbO3)2', 'Ca(OH)2', 'Ca(VO3)2', 'Ca(VO4)2', 'Ca3(AsO4)2', 'Ca3(PO4)2', 'Ca3N2', 'Ca3P2', 'Ca4(PO4)2O', 'Ca5(PO4)3(OH)', 'Ca5(PO4)3F', 'CaAl2O4', 'CaB6', 'CaBr2', 'CaC2', 'CaC2O4', 'CaCN2', 'CaCO3', 'CaCl2', 'CaF2', 'CaH2', 'CaHPO4', 'CaI2', 'CaMoO4', 'CaO', 'CaO2', 'CaP', 'CaS', 'CaSO3', 'CaSO4', 'CaSO4·0.5H2O', 'CaSe', 'CaSeO3', 'CaSeO4', 'CaSiO3', 'CaTe', 'CaTeO3', 'CaTeO4', 'CaTiO3', 'CaWO4', 'Cd(C2H3O2)2', 'Cd(CN)2', 'Cd(IO3)2', 'Cd(N3)2', 'Cd(NO3)2', 'Cd(OH)2', 'Cd(TaO3)2', 'Cd2Nb2O7', 'Cd3(PO4)2', 'Cd3As2', 'Cd3P2', 'CdBr2', 'CdC2O4', 'CdCO3', 'CdCl2', 'CdCrO4', 'CdF2', 'CdI2', 'CdMoO4', 'CdO', 'CdS', 'CdSO3', 'CdSO4', 'CdSb', 'CdSe', 'CdSeO3', 'CdSiO3', 'CdTe', 'CdTeO4', 'CdTiO3', 'CdWO4', 'CdZrO3', 'Ce(SO4)2', 'Ce2C3', 'Ce2O3', 'Ce2S3', 'CeB6', 'CeBr3', 'CeC', 'CeCl3', 'CeF3', 'CeF4', 'CeI2', 'CeI3', 'CeN', 'CeO2', 'CeS', 'CeSi2', 'Cl2', 'Cl2O3', 'Cl2O6', 'Cl2O7', 'Cl2O8', 'ClF', 'ClF3', 'ClF5', 'ClO2', 'ClO3F', 'ClOClO3', 'Co(C18H33O2)2', 'Co(C2H3O2)2', 'Co(C2H3O2)3', 'Co(CN)2', 'Co(ClO4)2', 'Co(IO3)2', 'Co(NO3)2', 'Co(NO3)3', 'Co(OH)2', 'Co(OH)3', 'Co2B', 'Co2S3', 'Co2SO4', 'Co2SiO4', 'Co2SnO4', 'Co2TiO4', 'Co3(AsO4)2', 'Co3(Fe(CN)6)2', 'CoAl2O4', 'CoAs', 'CoAs2', 'CoB', 'CoBr2', 'CoC2O4', 'CoCl2', 'CoCr2O4', 'CoCrO4', 'CoF2', 'CoF3', 'CoFe2O4', 'CoI2', 'CoMoO4', 'CoO', 'CoS', 'CoS2', 'CoSb', 'CoSe', 'CoSeO3', 'CoTe', 'CoTiO3', 'CoWO4', 'Cr(NO2)3', 'Cr(NO3)3', 'Cr(OH)3', 'Cr2(SO4)3', 'Cr2(TeO4)3', 'Cr2O3', 'Cr2S3', 'Cr2Se3', 'Cr2Te3', 'Cr3As2', 'Cr3C2', 'Cr3Sb2', 'CrBr2', 'CrBr3', 'CrCl2', 'CrCl3', 'CrCl4', 'CrF2', 'CrF3', 'CrF4', 'CrF5', 'CrF6', 'CrI2', 'CrI3', 'CrO2', 'CrO2Cl2', 'CrO3', 'CrO42', 'CrPO4', 'CrSb', 'CrSe', 'CrSi2', 'CrVO4', 'Cs2C2O4', 'Cs2CO3', 'Cs2Cr2O7', 'Cs2CrO4', 'Cs2HPO3', 'Cs2HPO4', 'Cs2MoO4', 'Cs2NbO3', 'Cs2O', 'Cs2O2', 'Cs2S', 'Cs2SO3', 'Cs2SO4', 'Cs2SiO3', 'Cs2TeO4', 'Cs2TiO3', 'Cs2WO4', 'Cs3PO3', 'Cs3PO4', 'Cs3VO4', 'CsBO2', 'CsBr', 'CsBr3', 'CsBrO', 'CsBrO2', 'CsBrO3', 'CsBrO4', 'CsC2H3O2', 'CsCN', 'CsCNO', 'CsCl', 'CsClO', 'CsClO2', 'CsClO3', 'CsClO4', 'CsF', 'CsH', 'CsH2PO3', 'CsH2PO4', 'CsHCO3', 'CsHS', 'CsHSO3', 'CsHSO4', 'CsI', 'CsI3', 'CsIO', 'CsIO2', 'CsIO3', 'CsIO4', 'CsN3', 'CsNH2', 'CsNO2', 'CsNO3', 'CsNbO3', 'CsO2', 'CsOH', 'CsSCN', 'CsSeO4', 'CsTaO3', 'Cu(BrO3)2·6H2O', 'Cu(CH3COO)', 'Cu(CH3COO)2', 'Cu(ClO3)2·6H2O', 'Cu(IO3)2', 'Cu(NO3)2', 'Cu(NO3)2·3H2O', 'Cu(NO3)2·6H2O', 'Cu(NbO3)2', 'Cu(OH)2', 'Cu(VO3)2', 'Cu2(OH)2CO3', 'Cu2CO3(OH)2', 'Cu2O', 'Cu2S', 'Cu2Se', 'Cu2Te', 'Cu3(PO4)2', 'Cu3As', 'Cu3P', 'Cu3Sb', 'Cu9S5', 'CuBr', 'CuBr2', 'CuC2O4', 'CuCl', 'CuCl2', 'CuF', 'CuF2', 'CuFe2O4', 'CuFe2S3', 'CuFeS2', 'CuI', 'CuIO3', 'CuMoO4', 'CuO', 'CuS', 'CuSCN', 'CuSO4', 'CuSO4·5H2O', 'CuSe', 'CuSeO3·2H2O', 'CuSeO4·5H2O', 'CuSiO3', 'CuTe', 'CuTeO3', 'CuTiO3', 'CuWO4', 'D2O', 'D3O+', 'D75-4590', 'DBr', 'DI', 'DLi', 'DNa', 'Dy2O3', 'Dy2S3', 'DyBr3', 'DyCl2', 'DyCl3', 'DySi2', 'E1210', 'ErCl3', 'ErF', 'ErF2', 'ErF3', 'ErI3', 'ErI4Na', 'ErO', 'Eu2(SO4)3', 'Eu2O', 'Eu2O2', 'Eu2O3', 'Eu2S', 'Eu2S2', 'EuCl2', 'EuCl3', 'EuF', 'EuF3', 'EuI2', 'EuNb2O6', 'EuNbO2', 'EuO', 'EuO2V', 'EuO3Ti', 'EuO3V', 'EuO4W', 'EuS', 'EuS2', 'EuSO4', 'F10Mo2', 'F10S2', 'F15Mo3', 'F2', 'F2Fe', 'F2Ga', 'F2Gd', 'F2Ge', 'F2GeO', 'F2Hg', 'F2Hg2', 'F2Ho', 'F2IP', 'F2K2', 'F2Kr', 'F2La', 'F2Li2', 'F2Mg', 'F2Mn', 'F2Mo', 'F2MoO2', 'F2N', 'F2N2O', 'F2Na2', 'F2Nd', 'F2Ni', 'F2O', 'F2O2', 'F2O2S', 'F2O2W', 'F2O5S3', 'F2OS', 'F2OSi', 'F2OTi', 'F2P', 'F2Pb', 'F2Pt', 'F2Pu', 'F2S', 'F2S2', 'F2S2W', 'F2SW', 'F2Sc', 'F2Se', 'F2Si', 'F2Sn', 'F2Sr', 'F2Th', 'F2Ti', 'F2Tl2', 'F2W', 'F2Xe', 'F2Y', 'F2Zn', 'F2Zr', 'F3Fe', 'F3Ga', 'F3Gd', 'F3Ho', 'F3La', 'F3Li3', 'F3Lu', 'F3Mn', 'F3Mo', 'F3MoO', 'F3MoS', 'F3N', 'F3NO', 'F3NO2S', 'F3NO3S', 'F3NS', 'F3NaSn', 'F3Nd', 'F3OP', 'F3OTa', 'F3OV', 'F3P', 'F3PS', 'F3Pr', 'F3Pu', 'F3Rh', 'F3S', 'F3SW', 'F3Sb', 'F3Sc', 'F3Si', 'F3Sm', 'F3Tb', 'F3Th', 'F3Ti', 'F3Tl', 'F3Tm', 'F3W', 'F3Y', 'F3Yb', 'F3Zr', 'F4Ge', 'F4Ge2', 'F4Hf', 'F4Mg2', 'F4Mo', 'F4MoO', 'F4MoS', 'F4N2', 'F4Na2Sn', 'F4OOs', 'F4OP2', 'F4ORe', 'F4OS', 'F4OW', 'F4OXe', 'F4P2', 'F4Pb', 'F4Pt', 'F4Pu', 'F4S', 'F4SW', 'F4Se', 'F4Si', 'F4Sn2', 'F4Ti', 'F4U', 'F4W', 'F4Xe', 'F4Zr', 'F5I', 'F5Mo', 'F5ORe', 'F5P', 'F5Pu', 'F5S', 'F5Sb', 'F5Ta', 'F5U', 'F5W', 'F6Fe2', 'F6La2', 'F6Mo', 'F6NP3', 'F6Os', 'F6Pu', 'F6Re', 'F6S', 'F6Se', 'F6Si2', 'F6Sn3', 'F6Te', 'F6U', 'F6W', 'F6Xe', 'F7I', 'F7NS', 'F7Re', 'F8Si3', 'FGa', 'FGaO', 'FGd', 'FGe', 'FHo', 'FI', 'FI2', 'FIn', 'FLa', 'FLi', 'FLi2', 'FLiO', 'FMg', 'FMn', 'FMnO3', 'FMo', 'FN', 'FNO', 'FNO2', 'FNO3', 'FNS', 'FNa', 'FNa2', 'FNd', 'FO', 'FO2', 'FO3S', 'FOTh', 'FOTi', 'FP', 'FPS', 'FPS2', 'FPb', 'FPu', 'FRb', 'FS', 'FSc', 'FSm', 'FSn', 'FSr', 'FTh', 'FTi', 'FTl', 'FW', 'FXe', 'FY', 'FZr', 'Fe(OH)2', 'Fe(OH)3', 'Fe(SCN)3', 'Fe2I2', 'Fe2I4', 'Fe2O12S3', 'Fe2O12W3', 'Fe2O3', 'Fe2P', 'Fe2S3', 'Fe2SiO4', 'Fe3H2Na2O45Si', 'Fe3O4', 'Fe3P', 'Fe4(P2O7)3', 'Fe7Si8O24H2', 'FeAsS', 'FeBr2', 'FeBr3', 'FeBr3·6H2O', 'FeC10H10', 'FeC2O4', 'FeC5O5', 'FeCO3', 'FeCl2', 'FeCl3', 'FeCr2O4', 'FeF2', 'FeF2·4H2O', 'FeI', 'FeI2', 'FeI2·4H2O', 'FeI3', 'FeMoO4', 'FeO', 'FeO2', 'FeO2H', 'FeO2H·nH2O', 'FeO4S', 'FeO4Se', 'FeO8H4P2', 'FeP', 'FePO4', 'FeS', 'FeS2', 'FeSe', 'FeTe', 'FeTiO3', 'FeVO4', 'FeWO4', 'FeZrO3', 'Ga(C2H3O2)3', 'Ga(ClO4)3', 'Ga(OH)3', 'Ga2(SO4)3·18H2O', 'Ga2O3', 'Ga2S3', 'Ga2Te3', 'GaAs', 'GaAsO4', 'GaBr3', 'GaCl2', 'GaCl3', 'GaI2', 'GaI3', 'GaN', 'GaPO4', 'GaSb', 'GaTe', 'GeBr4', 'GeH3COOH', 'GeI2', 'GeI4', 'GeO', 'H2', 'H2C(CH)CN', 'H2C2O4', 'H2C4H4O6', 'H2C8H4O4', 'H2CO', 'H2CO3', 'H2CSO', 'H2CrO4', 'H2N2O2', 'H2NCH2COOH', 'H2NNH2', 'H2O', 'H2O2', 'H2O2Si', 'H2PO4', 'H2S', 'H2S2O2', 'H2S2O3', 'H2S2O4', 'H2S2O5', 'H2S2O6', 'H2S2O7', 'H2S2O8', 'H2SO3', 'H2SO4', 'H2SeO3', 'H2SeO4', 'H2SiO3', 'H2TeO3', 'H2TiO3', 'H3AsO4', 'H3CCH2CH3', 'H3N+CH2COO', 'H3O+', 'H3PO2', 'H3PO3', 'H3PO4', 'H4XeO6', 'H6TeO6', 'HArF', 'HAt', 'HBr', 'HBrO', 'HBrO2', 'HBrO3', 'HBrO4', 'HC12H17ON4SCl2', 'HC3H5O3', 'HC5H5N+', 'HC6H7O6', 'HC9H7O4', 'HCCH', 'HCN', 'HCNO', 'HCO3', 'HCONH2', 'HCOO', 'HCOOH', 'HCOONH4', 'HCl', 'HClO', 'HClO2', 'HClO3', 'HClO4', 'HDO', 'HF', 'HI', 'HIO', 'HIO2', 'HIO3', 'HIO4', 'HN3', 'HNCO', 'HNO', 'HNO2', 'HNO3', 'HOBr', 'HOCl', 'HOF', 'HOOCCOOH', 'HPO42', 'HSO3', 'HSO4', 'HTO', 'Hf(SO4)2', 'HfBr4', 'HfF4', 'HfOCl2·8H2O', 'HfOH(C2H3O2)3', 'Hg(BrO3)2·2H2O', 'Hg(C2H3O2)2', 'Hg(C7H5O2)2·H2O', 'Hg(CNO)2', 'Hg(ClO4)2·3H2O', 'Hg(IO3)2', 'Hg(NO3)2·H2O', 'Hg(OH)2', 'Hg(SCN)2', 'Hg2Br2', 'Hg2Cl2', 'Hg2I2', 'Hg3(AsO4)2', 'Hg3(PO4)2', 'HgBr2', 'HgCl2', 'HgClO4·4H2O', 'HgI2', 'HgNa', 'HgO', 'HgS', 'HgSe', 'HgSeO3', 'HgTe', 'HgTeO3', 'HgWO4', 'I2', 'I2O5', 'I3', 'I5', 'IBr', 'IBr3', 'ICl', 'ICl3', 'INH1', 'IO3', 'In(IO3)3', 'In(NO3)3·4.5H2O', 'In(OH)3', 'In2(SO4)3·H2O', 'In2O3', 'In2S3', 'In2Se3', 'In2Te3', 'InAs', 'InBr', 'InBr2I', 'InBr3', 'InBrI2', 'InCl', 'InCl2', 'InCl3', 'InCl3·4H2O', 'InI', 'InI2', 'InI3', 'InP', 'InPO4', 'InS', 'InSb', 'InTe', 'IrBr3', 'JD5037', 'JV-1-36', 'K2CO3', 'K2Cr2O7', 'K2CrO4', 'K2HAsO4', 'K2HPO3', 'K2HPO4', 'K2MnO4', 'K2N2O2', 'K2O', 'K2O2', 'K2S', 'K2S2O3', 'K2S2O5', 'K2S2O8', 'K2SO3', 'K2SO4', 'K3AsO4', 'K3C6H5O7', 'K3PO3', 'K3PO4', 'KAl(SO4)2', 'KAsO2', 'KBr', 'KBrO', 'KBrO2', 'KBrO3', 'KBrO4', 'KCN', 'KCNO', 'KCNS', 'KCl', 'KClO', 'KClO2', 'KClO3', 'KClO4', 'KF', 'KH', 'KH2AsO4', 'KH2PO3', 'KH2PO4', 'KHCO3', 'KHS', 'KHSO3', 'KHSO4', 'KI', 'KIO', 'KIO2', 'KIO3', 'KIO4', 'KMnO4', 'KNO2', 'KNO3', 'KNbO3', 'KOF', 'KOH', 'L-165041', 'L-DOPA', 'LY3372689', 'La(OH)3', 'La2O3', 'LaBr3', 'LaCl3', 'LaI3', 'LaPO4', 'LaPO4·0.5H2O', 'Li(AlSi2O6)', 'Li2B4O7·5H2O', 'Li2CO3', 'Li2Cr2O7', 'Li2CrO4', 'Li2CrO4·2H2O', 'Li2HAsO4', 'Li2HPO3', 'Li2HPO4', 'Li2MoO4', 'Li2N2O2', 'Li2NbO3', 'Li2O', 'Li2O2', 'Li2S', 'Li2SO3', 'Li2SO4', 'Li2SeO3', 'Li2SeO4', 'Li2SiO3', 'Li2TeO3', 'Li2TeO4', 'Li2TiO3', 'Li2WO4', 'Li2ZrO3', 'Li3AsO4', 'Li3PO3', 'Li3PO4', 'LiAlH4', 'LiBH4', 'LiBr', 'LiBrO', 'LiBrO2', 'LiBrO3', 'LiBrO4', 'LiBr·2H2O', 'LiC2H5O', 'LiCN', 'LiCNO', 'LiCl', 'LiClO', 'LiClO2', 'LiClO3', 'LiClO4', 'LiF', 'LiH', 'LiH2AsO4', 'LiH2PO3', 'LiH2PO4', 'LiHCO3', 'LiHS', 'LiHSO3', 'LiHSO4', 'LiI', 'LiIO', 'LiIO2', 'LiIO3', 'LiIO4', 'LiNO2', 'LiNO3', 'LiNO3·H2O', 'LiNa', 'LiNaNO2', 'LiNbO3', 'LiOH', 'LiTaO3', 'LiVO3·2H2O', 'Mg(AlO2)2', 'Mg(BrO)2', 'Mg(BrO2)2', 'Mg(BrO3)2', 'Mg(BrO4)2', 'Mg(ClO)2', 'Mg(ClO2)2', 'Mg(ClO3)2', 'Mg(ClO3)2·xH2O', 'Mg(ClO4)2', 'Mg(IO)2', 'Mg(IO2)2', 'Mg(IO3)2', 'Mg(IO4)2', 'Mg(NO2)2', 'Mg(NO3)2', 'Mg(NO3)2·6H2O', 'Mg(OH)2', 'Mg(VO3)2', 'Mg2Al(AlSiO5)(OH)4', 'Mg2P2O7', 'Mg2SiO4', 'Mg3(Si2O5)(OH)4', 'Mg3(Si4O10)(OH)2', 'Mg3(VO4)2', 'Mg3As2', 'Mg3Bi2', 'Mg3P2', 'MgBr2', 'MgC2O4', 'MgCO3', 'MgCl2', 'MgCrO4', 'MgCrO4·5H2O', 'MgF2', 'MgHPO4', 'MgI2', 'MgMoO4', 'MgNH4PO4·6H2O', 'MgNaAl5(Si4O10)3(OH)6', 'MgO', 'MgPo', 'MgS', 'MgSO3', 'MgSO4', 'MgSe', 'MgSeO3', 'MgSeO4', 'MgSiO3', 'MgTiO3', 'MgWO4', 'Mn(CHO2)2', 'Mn(CHO2)2·2H2O', 'Mn(NO3)2', 'Mn(NO3)2·4H2O', 'Mn(OH)2', 'Mn2O3', 'Mn3As2', 'Mn3O4', 'Mn3P2', 'Mn3Sb2', 'MnAs', 'MnBi', 'MnBr2', 'MnBr2·4H2O', 'MnCO3', 'MnCl2', 'MnF2', 'MnI2', 'MnMoO4', 'MnO', 'MnO2', 'MnO4', 'MnOOH', 'MnPb8(Si2O7)3', 'MnS', 'MnTe', 'MnZrO3', 'MoBr2', 'MoBr3', 'MoCl2', 'MoCl3', 'MoCl5', 'MoO2', 'MoO3', 'MoO42', 'MoS2', 'MoSe2', 'N2', 'N2H2', 'N2H4', 'N2O', 'N2O3', 'N2O4', 'N2O5', 'N3', 'N4H4', 'NCl3', 'NH2', 'NH2C6H4SO3H', 'NH2CH2CH2NH2', 'NH2CH2CN', 'NH2CONH2', 'NH2COOH', 'NH2Cl', 'NH2OH', 'NH3', 'NH4+', 'NH4Br', 'NH4CO2NH2', 'NH4Cl', 'NH4ClO4', 'NH4HS', 'NH4NO3', 'NH4OCONH2', 'NH4OH', 'NHCl2', 'NI3', 'NO', 'NO2', 'NO2Cl', 'NO3', 'NO4-', 'NOBr', 'NOCl', 'NOI', 'Na2C2O4', 'Na2C6H6O7', 'Na2CO3', 'Na2Cr2O7·2H2O', 'Na2HAsO4', 'Na2HPO3', 'Na2HPO4', 'Na2MoS4', 'Na2N2O2', 'Na2O', 'Na2O2', 'Na2S', 'Na2S2O3', 'Na2S2O5', 'Na2S2O8', 'Na2S4', 'Na2SO3', 'Na2SO4', 'Na2SeO3', 'Na2SeO4', 'Na2TeO3', 'Na2TeO4', 'Na2TiO3', 'Na2U2O7', 'Na2Zn(OH)4', 'Na2ZnO2', 'Na2ZrO3', 'Na3AlF6', 'Na3AsO4', 'Na3C6H5O7', 'Na3PO3', 'Na3PO4', 'Na3VO4', 'Na3[Co(CO3)3]', 'Na4V2O7', 'NaAlSi3O3', 'NaAsO2', 'NaAu(CN)2', 'NaBr', 'NaBrO', 'NaBrO2', 'NaBrO3', 'NaBrO4', 'NaC6F5COO', 'NaC6H5COO', 'NaC6H7O7', 'NaCN', 'NaCNO', 'NaCa2(Al5Si5O20)·6H2O', 'NaCl', 'NaClO2', 'NaClO3', 'NaClO4', 'NaF', 'NaH', 'NaH2AsO4', 'NaH2PO3', 'NaH2PO4', 'NaHCO3', 'NaHCOO', 'NaHS', 'NaHSO3', 'NaHSO4', 'NaI', 'NaIO', 'NaIO2', 'NaIO3', 'NaIO4', 'NaNH2C6H4SO3', 'NaNO2', 'NaNO3', 'NaNbO3', 'NaNbO3·7H2O', 'NaO2As(CH3)2·3H2O', 'NaOCN', 'NaOCl', 'NaOF', 'NaOH', 'NaSeO3', 'NaTaO3', 'NaVO3', 'Na[B(NO3)4]', 'Nb2O3', 'NbBr5', 'NbCl3', 'NbCl5', 'NbI5', 'Nd(CH3COO)3', 'Nd(OH)3', 'Nd2O3', 'NdAsO4', 'NdCl2', 'NdI2', 'NdI3', 'Ni(CO)3', 'Ni(CO)4', 'Ni(H2PO)2·6H2O', 'Ni(NO3)2·6H2O', 'Ni(OH)2', 'Ni(VO3)2', 'Ni2SiO4', 'Ni3(PO4)2', 'Ni3Sb2', 'NiAs', 'NiAsS', 'NiBr2', 'NiBr2·3H2O', 'NiBr2·6H2O', 'NiC2O4·2H2O', 'NiCl2', 'NiFe2O4', 'NiI2', 'NiMoO4', 'NiO', 'NiOOH', 'NiS', 'NiS2', 'NiSO4', 'NiSb', 'NiSe', 'NiTiO3', 'NiWO4', 'O2', 'O22', 'O2F2', 'O2Ti', 'O2U', 'O3', 'O3U', 'OF2', 'OH', 'OV', 'P2I4', 'P2O5', 'P2S3', 'P2Se3', 'P3N5', 'PCl3', 'PCl5', 'PH3', 'POCl3', 'Pb(IO3)2', 'Pb(N3)2', 'Pb(NO3)2', 'Pb(OH)2', 'Pb(OH)4', 'Pb2', 'PbC2O4', 'PbCO3', 'PbCl2', 'PbCl4', 'PbCrO4', 'PbF2', 'PbHAsO4', 'PbI2', 'PbO', 'PbO2', 'PbS', 'PbSO4', 'PoBr2', 'PoCl2', 'PoCl4', 'PoF6', 'PoH2', 'PoO', 'PoO2', 'PoO3', 'RI-1', 'RaCl2', 'Rb2CO3', 'Rb2HPO3', 'Rb2HPO4', 'Rb2O', 'Rb2O2', 'Rb2S', 'Rb2SO3', 'Rb2SO4', 'Rb3PO3', 'Rb3PO4', 'RbBr', 'RbBrO', 'RbBrO2', 'RbBrO3', 'RbBrO4', 'RbCN', 'RbCNO', 'RbCl', 'RbClO', 'RbClO2', 'RbClO3', 'RbClO4', 'RbF', 'RbH', 'RbH2PO3', 'RbH2PO4', 'RbHCO3', 'RbHS', 'RbHSO3', 'RbHSO4', 'RbI', 'RbIO', 'RbIO2', 'RbIO3', 'RbIO4', 'RbNO2', 'RbNO3', 'RbNbO3', 'RbOH', 'RnF2', 'RuCl3', 'RuF6', 'RuO4', 'S2242', 'S2Br2', 'S2O32', 'S2O72', 'SCH900271', 'SCN', 'SF4', 'SF6', 'SO2', 'SO2Cl2', 'SO2F2', 'SO2OOH', 'SO3', 'SO32', 'SO42', 'SOF2', 'Sb2O3', 'Sb2O5', 'Sb2OS2', 'Sb2S3', 'Sb2Se3', 'Sb2Se5', 'Sb2Te3', 'SbBr3', 'SbCl3', 'SbCl5', 'SbI3', 'SbPO4', 'Sc2O3', 'SeBr4', 'SeCl', 'SeCl4', 'SeO2', 'SeO42', 'SeOCl2', 'SeOF2', 'SeTe', 'Si2O76', 'Si3N4', 'Si6O1812', 'SiBr4', 'SiC', 'SiCl4', 'SiH4', 'SiI4', 'SiO2', 'SiO44', 'Sn(CH3COO)2', 'Sn(CH3COO)4', 'Sn(CrO4)2', 'Sn(OH)2', 'Sn(OH)4', 'Sn(SO4)2·2H2O', 'Sn(VO3)2', 'Sn3Sb4', 'SnBr2', 'SnBr2Cl2', 'SnBr3Cl', 'SnBr4', 'SnBrCl3', 'SnCl2', 'SnCl2I2', 'SnCl4', 'SnI4', 'SnO', 'SnO2', 'SnO32', 'SnS', 'SnS2', 'SnSe', 'SnSe2', 'SnTe', 'SnTe4', 'Sr(ClO)2', 'Sr(ClO2)2', 'Sr(ClO3)2', 'Sr(ClO4)2', 'Sr(HS)2', 'Sr(IO)2', 'Sr(IO2)2', 'Sr(IO3)2', 'Sr(IO4)2', 'Sr(MnO4)2', 'Sr(NbO3)2', 'Sr(OH)2', 'Sr2RuO4', 'SrBr2', 'SrBr2·6H2O', 'SrC2O4', 'SrCO3', 'SrCl2', 'SrF2', 'SrHfO3', 'SrI2', 'SrI2·6H2O', 'SrMoO4', 'SrO', 'SrS', 'SrSeO3', 'SrSeO4', 'SrTeO3', 'SrTeO4', 'SrTiO3', 'T2O', 'TSQ', 'TaBr3', 'TaBr5', 'TaCl5', 'TaI5', 'TaO3', 'TcO4', 'TeBr2', 'TeBr4', 'TeCl2', 'TeCl4', 'TeI2', 'TeI4', 'TeO2', 'TeO4', 'TeY', 'Th(CO3)2', 'Th(NO3)4', 'Th(SO4)2', 'ThO2', 'TiBr4', 'TiCl2I2', 'TiCl3I', 'TiCl4', 'TiH2', 'TiI4', 'TiO(NO3)2·xH2O', 'TiO2', 'TiO32', 'Tl(C3H3O4)', 'Tl(CHO2)', 'Tl2MoO4', 'Tl2SeO3', 'Tl2TeO3', 'Tl2WO4', 'Tl3As', 'TlBr', 'TlBr3', 'TlC2H3O2', 'TlCl', 'TlCl3', 'TlF', 'TlI', 'TlI3', 'TlIO3', 'TlNO3', 'TlOH', 'TlPF6', 'TlSCN', 'Tm(NO3)3', 'Tm2(SO4)3', 'TmCl3', 'U3O8', 'UBr2', 'UBr3', 'UBr5', 'UC2', 'UCl3', 'UCl4', 'UF4', 'UF6', 'UI3', 'UN', 'UO2', 'UO2(CH3COO)2', 'UO2(HCOO)2', 'UO2(NO3)2', 'UO2Cl2', 'UO2SO4', 'UO3', 'US2', 'USe2', 'UTe2', 'V2O3', 'V2O5', 'V2O74', 'VBr2', 'VBr3', 'VCl2', 'VCl3', 'VI3', 'VN', 'VOC2O4', 'VOSO4', 'W(CO)6', 'WBr2', 'WBr3', 'WBr4', 'WBr5', 'WBr6', 'WC', 'WCl2', 'WCl3', 'WCl4', 'WCl5', 'WCl6', 'WF4', 'WF5', 'WF6', 'WI2', 'WI4', 'WO2', 'WO2Br2', 'WO2Cl2', 'WO2I2', 'WO3', 'WO42', 'WOBr3', 'WOBr4', 'WOCl3', 'WOCl4', 'WOF4', 'WS2', 'WS3', 'WSe2', 'WTe2', 'Xe(C6F6)2', 'XeBr2', 'XeCl', 'XeCl2', 'XeCl4', 'XeF', 'XeF2', 'XeF4', 'XeF6', 'XeO2', 'XeO2F2', 'XeO3', 'XeO4', 'XeOF2', 'XePtF6', 'XeRhF6', 'Y2O3', 'Y2S3', 'YAs', 'YB6', 'YBr3', 'YC2', 'YCl3', 'YF3', 'YP', 'YSb', 'YVO4', 'Yb(ClO4)3', 'Yb2O3', 'Yb2S3', 'Yb2Se3', 'YbBr2', 'YbBr3', 'YbCl2', 'YbCl3', 'YbCl3·6H2O', 'YbF2', 'YbF3', 'YbI2', 'YbI3', 'YbPO4', 'YbSe', 'YbSi2', 'YbTe','Zn(AlO2)2', 'Zn(AsO2)2', 'Zn(C8H15O2)2', 'Zn(CN)2', 'Zn(ClO3)2', 'Zn(IO3)2', 'Zn(NO2)2', 'Zn(NO3)2', 'Zn(NbO3)2', 'Zn(OH)2', 'Zn(OH)42', 'Zn(SCN)2', 'Zn(SeCN)2', 'Zn(TaO3)2', 'Zn(VO3)2', 'Zn2P2O7', 'Zn2SiO4', 'Zn3(AsO4)2', 'Zn3(PO4)2', 'Zn3As2', 'Zn3N2', 'Zn3P2', 'Zn3Sb2', 'ZnBr2', 'ZnCO3', 'ZnCl2', 'ZnCr2O4', 'ZnF2', 'ZnI2', 'ZnMoO4', 'ZnO', 'ZnO2', 'ZnS', 'ZnS2O3', 'ZnSO3', 'ZnSO4', 'ZnSb', 'ZnSe', 'ZnSeO3', 'ZnSeO4', 'ZnSnO3', 'ZnTe', 'ZnTeO3', 'ZnTeO4', 'ZnTiO3', 'ZnWO4', 'ZnZrO3', 'Zr(NO3)4', 'Zr(OH)4', 'Zr(SO4)2', 'Zr3(PO4)4', 'ZrB2', 'ZrBr4', 'ZrC', 'ZrCl4', 'ZrF4', 'ZrI4', 'ZrN', 'ZrO2', 'ZrO32', 'ZrP2', 'ZrS2', 'ZrSi2', 'ZrSiO4'
    ]);

    /**
     * Fetches element data from JSON and initializes the game.
     */
    async function loadPeriodicTableData() {
        try {
            const response = await fetch('assets/data/PeriodicTable.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            elementsData = data.elements;
            createPeriodicTable(elementsData);
            startGame();
        } catch (error) {
            console.error("Failed to load periodic table data:", error);
            feedbackDiv.textContent = "Error: Could not load element data. Please refresh the page.";
            feedbackDiv.classList.add('feedback-incorrect');
        }
    }

    /**
 * Creates and populates the periodic table in the DOM, including category-based color-coding.
 * @param {Array} elements - The array of element objects from JSON.
 */
    function createPeriodicTable() {
        periodicTableDiv.innerHTML = ''; // Clear any existing content
        elementsData.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';

            // *** FIX: Add category names as separate classes ***
            // This splits "transition metal" into "transition" and "metal" classes,
            // allowing CSS selectors like `.transition.metal` to work.
            if (element.category) {
                 const categories = element.category.split(' ');
                 elementDiv.classList.add(...categories);
            }

            elementDiv.style.gridColumn = element.xpos;
            elementDiv.style.gridRow = element.ypos;
            
            elementDiv.innerHTML = `
                <div class="number">${element.number}</div>
                <div class="symbol">${element.symbol}</div>
                <div class="name">${element.name}</div>
            `;

            elementDiv.addEventListener('click', () => handleElementClick(element.symbol));
            periodicTableDiv.appendChild(elementDiv);
        });
    }

    /**
     * Handles the click event on a periodic table element.
     * @param {string} symbol - The clicked element symbol.
     */
    function handleElementClick(symbol) {
        if (!gameActive) return;
        currentFormula.push(symbol);
        updateFormulaDisplay();
    }

    /**
     * Updates the formula display with proper subscript formatting.
     */
    function updateFormulaDisplay() {
        if (currentFormula.length === 0) {
            currentFormulaDiv.innerHTML = '';
            return;
        }

        const formulaString = aggregateFormula(currentFormula);
        currentFormulaDiv.innerHTML = ''; // Clear previous content

        const parts = formulaString.split(/([A-Z][a-z]*)(\d*)/).filter(p => p);
        parts.forEach(part => {
             if (/\d+/.test(part)) {
                const sub = document.createElement('sub');
                sub.textContent = part;
                currentFormulaDiv.appendChild(sub);
            } else {
                const symbolSpan = document.createElement('span');
                symbolSpan.textContent = part;
                currentFormulaDiv.appendChild(symbolSpan);
            }
        });
    }   
    
    /**
     * Aggregates and sorts the formula array based on electronegativity.
     * @param {string[]} formulaArray - The array of element symbols.
     * @returns {string} The chemically conventional formula string.
     */
    function aggregateFormula(formulaArray) {
        const counts = formulaArray.reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
        }, {});

        // Sort elements by electronegativity to adhere to chemical conventions.
        // The element with lower electronegativity (more cationic) comes first.
        const sortedSymbols = Object.keys(counts).sort((a, b) => {
            const elementA = elementsData.find(el => el.symbol === a);
            const elementB = elementsData.find(el => el.symbol === b);

            // Get electronegativity; default to a high value if null/undefined to sort it last.
            const electronegativityA = elementA?.electronegativity_pauling ?? 99;
            const electronegativityB = elementB?.electronegativity_pauling ?? 99;

            return electronegativityA - electronegativityB;
        });

        return sortedSymbols.map(symbol => {
            const count = counts[symbol];
            return count > 1 ? `${symbol}${count}` : symbol;
        }).join('');
    }


    /**
     * Handles the formula submission logic.
     */
    function submitFormula() {
        if (!gameActive || currentFormula.length === 0) return;

        const formulaString = aggregateFormula(currentFormula);

        if (validFormulas.has(formulaString) && !foundFormulas.has(formulaString)) {
            // Correct formula
            const points = formulaString.length;
            score += points;
            foundFormulas.add(formulaString);
            
            scoreSpan.textContent = score;
            feedbackDiv.textContent = `Correct! +${points} for ${formulaString}`;
            feedbackDiv.className = 'feedback feedback-correct';
        } else {
            // Incorrect or already found formula
            feedbackDiv.textContent = 'Invalid or already found formula. Try again!';
            feedbackDiv.className = 'feedback feedback-incorrect';
        }
        clearFormula();
    }

    /**
     * Clears the current formula input.
     */
    function clearFormula() {
        currentFormula = [];
        updateFormulaDisplay();
    }

    /**
     * Starts the game timer.
     */
    function startTimer() {
        timerId = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    /**
     * Starts a new game session.
     */
    function startGame() {
        score = 0;
        timeLeft = 120;
        foundFormulas.clear();
        gameActive = true;
        
        scoreSpan.textContent = score;
        timerSpan.textContent = timeLeft;
        feedbackDiv.textContent = 'Combine elements to form a valid chemical formula!';
        feedbackDiv.className = 'feedback';
        gameOverModal.style.display = 'none';

        clearFormula();
        if (timerId) clearInterval(timerId);
        startTimer();
    }
    
    /**
     * Ends the game and displays the final score modal.
     */
    function endGame() {
        clearInterval(timerId);
        gameActive = false;
        finalScoreSpan.textContent = score;
        gameOverModal.style.display = 'flex';
    }

    // --- Event Listeners ---
    submitBtn.addEventListener('click', submitFormula);
    clearBtn.addEventListener('click', clearFormula);
    newGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', startGame);

    // --- Initial Load ---
    loadPeriodicTableData();
});