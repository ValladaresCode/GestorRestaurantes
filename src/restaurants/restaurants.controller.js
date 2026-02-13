import Restaurant from "./restaurant.model.js";

export const createRestaurant = async (req, res) => {
    try {
        const restaurantData = req.body;

        // Si viene foto desde multer + cloudinary
        if (req.file) {
            restaurantData.restaurantPhoto = req.file.path;
        }

        const restaurant = new Restaurant(restaurantData);
        await restaurant.save();

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            data: restaurant
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating restaurant",
            error: error.message
        });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        let { page = 1, limit = 10, restaurantActive = true } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        restaurantActive = (restaurantActive === "false") ? false : true;

        const filter = { restaurantActive };

        const restaurants = await Restaurant.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Restaurant.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: restaurants,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching restaurants",
            error: error.message
        });
    }
};
