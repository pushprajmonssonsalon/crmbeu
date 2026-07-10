import { useEffect, useRef, useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';
import { getApiCall, loadRazorpay, postApiData } from '../../utils/services';
import toast from 'react-hot-toast';

export default function Plans() {
  const  [plans,setPlans]=useState([]);
  const [selectedPlan,setSelectedPlan]=useState({
    planId:""
  })
  const handlePlanClick=(id)=>{
   setSelectedPlan(()=>({
    planId:id
   }))
  }

        const processingRef = useRef(false); // this blocks immediately

  // const handleBuyPlan=async(planId)=>{
  //   try {

  //       if(!planId)return toast.error("select plan");
  //                     // console.log("data",2)

  //       if (processingRef.current) return; // block duplicate entry
  //       processingRef.current = true; // lock instantly
  //       const isLoaded = await loadRazorpay();
  //       if (!isLoaded) {
  //           toast.error("Razorpay failed")
  //           return
  //       }
  //       const data ={
  //         planId
  //       }
  //       postApiData("plan/purchasePlan",data,(res)=>{
  //         // console.log(res,"res")
  //         if(res){
            
  //                           const options = {
  //                               // key: "rzp_test_hdlZcgaBXfBRBr",
  //                               // key: "rzp_test_Ira5eelRPeWjZn",
  //                               key: "rzp_live_gPOHKfuDqbcZFw",
  //                               // key: "rzp_live_gPOHKfuDqbcZFw",
  //                               amount: res.amount, // Amount in paise
  //                               currency: "INR",
  //                               name: "The Professional World",
  //                               description: "Plan",
  //                               order_id: res.id,
  //                               handler: async (response) => {
  //                                   try {
  //                                     console.log(response,"response")

  //                                       if (response) {


  //                                           // captureOrderDetails(response?.razorpay_payment_id, response?.razorpay_order_id);
  //                                           // captureOrderDetails(
  //                                           //     responses?.razorpay_payment_id,
  //                                           //     response?._doc?._id,
  //                                           //     response?._doc?.totalPayableAmount,
  //                                           //     selectedOption
  //                                           // );

  //                                           // await getApiCall(
  //                                           //     `user/singleOrderHistory/${response?._id}`,
  //                                           //     (res) => {
  //                                           //         if (res?.isPaid) {
  //                                           //             setIsProcessing(true)
  //                                           //             toast.success("Your order has been placed");
  //                                           //             let prod = guestUserCartDetails.map(({ _id, quantity }) => ({
  //                                           //                 id: _id,
  //                                           //                 quantity,
  //                                           //             }))
  //                                           //             checkoutPageEvent(response?.totalPayableAmount, prod);
                                                        
  //                                           //             setTimeout(() => {
  //                                           //                 setSelectaddress(null)
  //                                           //                 setIsCartOpen(false);
  //                                           //                 setIsProcessing(false)
  //                                           //                 setLoading(false)
  //                                           //                 closeModal();
  //                                           //                 dispatch(successCartEmpty());

  //                                           //                 navigate(`/successorder/${response?._id}`);

  //                                           //             }, 2000)
  //                                           //         }
  //                                           //         else {
  //                                           //             toast.error("Payment Failed")
  //                                           //         }
  //                                           //     },
  //                                           //     () => {
  //                                           //         toast.error("Payment Failed")
  //                                           //     }
  //                                           // );


  //                                       } else {

  //                                       }
  //                                   } catch (error) {
  //                                   }



  //                               },
  //                               prefill: {
  //                                   // name: selectaddress?.name,
  //                                   // email: selectaddress?.email,
  //                                   // contact: selectaddress?.phoneNumber,
  //                               },
  //                               notes: {
  //                                   address: "Plot No-31 Okhla Industrial Estate, Phase – 3, South Delhi, New Delhi – 110020",
  //                               },
  //                               theme: {
  //                                   color: "#00000",
  //                               },
  //                           };

  //                           const razorpay = new window.Razorpay(options);
  //                           try {
  //                              razorpay.open();

  //                           } catch (error) {
  //                             console.log(error)
  //                           }
  //                                 razorpay.on("close", () => {
  //                               // setLoading(false);
  //                               processingRef.current = false

  //                               toast.error("Payment was canceled by the user.");
  //                           });
  //         }
  //       },(error)=>{
  //         console.log(error)
  //       })
  //   } catch (error) {
      
  //   }
  // }

  // Utility function: Load Razorpay script dynamically
const loadRazorpayScript = async () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Main payment handler
const handleBuyPlan = async (planId) => {
  try {
    // Step 1: Validate plan selection
    if (!planId) {
      toast.error("Please select a plan before proceeding.");
      return;
    }

    // Step 2: Prevent multiple concurrent transactions
      if (processingRef.current) return; // block duplicate entry
        processingRef.current = true; // loc

    // Step 3: Ensure Razorpay script is loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay. Please refresh and try again.");
      processingRef.current = false;
      return;
    }

    // Step 4: Create order on server
    const payload = { planId };
    postApiData(
      "plan/purchasePlan",
      payload,
      (orderResponse) => {
        if (!orderResponse) {
          toast.error("Unable to initiate payment. Please try again later.");
          processingRef.current = false;
          return;
        }

        // Step 5: Configure Razorpay options
        const options = {
          key: process.env.REACT_APP_PLAN_RAZORPAY_KEY,
          amount: orderResponse.amount, 
          currency: "INR",
          name: "The Professional World",
          description: "Plan Purchase",
          order_id: orderResponse.id,
          handler: async (paymentResponse) => {
            try {
              
              if (!paymentResponse) {
                processingRef.current = false;

                toast.error("No response from payment gateway.");
                return;
              }
              

              toast.success("Payment successful! Your plan is now active.");
            } catch (err) {
                        processingRef.current = false;

              console.error("Payment verification failed:", err);
              toast.error("Something went wrong while verifying payment.");
            } finally {
              processingRef.current = false;
            }
          },
          prefill: {
            // Optional: fill from user profile
            // name: user.name,
            // email: user.email,
            // contact: user.phone,
          },
          notes: {
            address:
              "Plot No-31, Okhla Industrial Estate, Phase – 3, South Delhi, New Delhi – 110020",
          },
          theme: {
            color: "#000000",
          },
        };

        // Step 6: Open Razorpay Checkout
        try {
          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open(); 
            setTimeout(() => {
          processingRef.current = false                                
                                
            }, 1200); // Adjust 

          // Handle user closing payment popup
          razorpayInstance.on("close", () => {
            processingRef.current = false;
            toast.error("Payment was canceled by the user.");
          });

        } catch (err) {
          console.error("Failed to open Razorpay:", err);
          processingRef.current = false;
          toast.error("Unable to open Razorpay checkout.");
        }
      },
      (error) => {
        console.error("Order creation failed:", error);
        toast.error("Failed to create order. Please try again.");
        processingRef.current = false;
      }
    );
  } catch (err) {
    console.error("Unexpected error in handleBuyPlan:", err);
    toast.error("Something went wrong. Please try again later.");
    processingRef.current = false;
  }
};

  

  useEffect(() => {
    getApiCall("plan/getplans",(res)=>{
    setPlans(res)
    },
    ()=>{

    })
  
   
  }, [])


  // useEffect(()=>{

  // },[])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start your monthly plan today.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <div
              className={`px-6 py-2 rounded-full font-medium transition-all bg-purple-600 text-white shadow-sm`}
            >
              Monthly
            </div>
           
          </div>
          
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans?.length>0?plans.map((plan, index) => (
            <div
             onClick={()=>handlePlanClick(plan._id)}
              key={index}
              className={`relative cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
               (selectedPlan.planId==plan._id)? 'ring-4 ring-ternary' : ''
              }`}
            >
              {
                (index==1)  && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-ternary to-pink-600 text-white px-4 py-1 rounded-bl-lg font-semibold flex items-center gap-1">
                  <IoSparkles className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                     ₹{plan?.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /month
                    </span>
                  </div>
                
                </div>

                {/* CTA Button */}
                <button
                 onClick={()=>handleBuyPlan(plan._id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                 (selectedPlan.planId==plan._id)||
                (index==1) 
                      ? 'bg-gradient-to-r from-ternary to-pink-600 text-white hover:from-ternary hover:to-pink-700 shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Buy Now
                </button>

                {/* Features List */}
                <div className="mt-8 space-y-4">
                  <p className="font-semibold text-gray-900 mb-4">
                    What's included:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <FaCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
           
          )): <div></div>}
        </div>

        
      </div>
    </div>
  );
}