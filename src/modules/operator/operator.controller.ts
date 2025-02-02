import { Request, Response } from 'express';
export const getOperatorDetails = async (req: Request, res: Response) => {
    try {
       
        res.json({
            success: true,
            data : {
                name : 'Operator ',
                location : 'Lagos',
                walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                timing : '9am - 5pm',
                operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                priceRange : '1000 - 5000',
            }
        });
       
    } catch (error) {
        console.error('Attestation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};