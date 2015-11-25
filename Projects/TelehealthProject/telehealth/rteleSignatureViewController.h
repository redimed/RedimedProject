//
//  rteleSignatureViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 10/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SignatureView.h"

@protocol signPadDelegate;
@interface rteleSignatureViewController : LandscapeOnlyUIViewController{
    BOOL mouseSwiped;
    CGPoint lastPoint;
    //UIImageView *drawimage;
    CGPoint minPoint;
    CGPoint maxPoint;
}
@property (nonatomic,assign) id <signPadDelegate> delegate;
@property (nonatomic, weak) IBOutlet SignatureView* drawimage;

-(IBAction)done:(id)sender;
@end
@protocol signPadDelegate

// By default, methods are "required"; you can change this by prefacing methods with "@optional"
- (void) signPadController:(rteleSignatureViewController *)signPadController didSign:(NSString *)signature;

@end